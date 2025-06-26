import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MemberCard } from "@/components/MemberCard";
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "@/lib/supabaseClient";

const Controls = React.lazy(() => import("@/components/Controls"));

interface Member {
  id: number;
  user_id: string;
  name: string;
  contributed: number;
  expected: number;
  avatar_url?: string;
}

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [groupTotals, setGroupTotals] = useState({
    totalExpected: 0,
    totalActual: 0,
    totalBalance: 0,
    expenses: 0,
    memberCount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);

      const { data: memberData, error: memberError } = await supabase
        .from("contributions")
        .select("*");

      if (memberError) {
        console.error("Error fetching contributions:", memberError);
        setMembers([]);
      } else {
        setMembers(memberData as Member[]);
      }

      const { data: groupData, error: groupError } = await supabase
        .from("group_totals")
        .select("*")
        .single();

      if (groupError) {
        console.error("Error fetching group totals:", groupError);
      } else if (groupData) {
        setGroupTotals({
          totalExpected: groupData.total_expected || 0,
          totalActual: groupData.total_actual || 0,
          totalBalance: groupData.total_balance || 0,
          expenses: groupData.expenses || 0,
          memberCount: groupData.member_count || 0,
        });
      }
    }

    fetchData();
  }, [navigate]);

  const numericMembers = members.map((m, i) => ({
    id: m.id ?? i,
    user_id: m.user_id,
    fullName: m.name,
    totalContribution: m.contributed || 0,
    expectedContribution: m.expected || 0,
    remainingBalance: Math.max(0, (m.expected || 0) - (m.contributed || 0)),
    avatar_url: m.avatar_url || null,
  }));

  const myMember = numericMembers.find((m) => m.user_id === userId);
  const otherMembers = numericMembers.filter((m) => m.user_id !== userId);

  const rankedMembers = [...otherMembers]
    .sort((a, b) => b.totalContribution - a.totalContribution)
    .slice(0, 3);

  return (
    <>
      <Suspense fallback={<div className="text-center p-4">Loading controls...</div>}>
        <Controls />
      </Suspense>

      {/* My Contributions Section with updated colors */}
      {myMember && (
        <div className="mb-8 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            My Contributions
          </h2>
          <div className="relative overflow-hidden rounded-2xl border border-blue-500 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-6 shadow-xl text-white">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 rounded-full bg-blue-500 opacity-10 blur-3xl z-0" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {myMember.avatar_url ? (
                    <img
                      src={myMember.avatar_url}
                      alt={myMember.fullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center">
                      {myMember.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="text-xl font-bold">{myMember.fullName}</div>
                </div>
                <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                  {myMember.totalContribution === 0
                    ? "No Payment"
                    : myMember.totalContribution < myMember.expectedContribution
                    ? "Partial Payment"
                    : "Fully Paid"}
                </span>
              </div>

              {/* Contribution details with icons and new colors */}
              <div className="grid grid-cols-3 gap-6">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                  title="Total amount you have contributed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth={2} />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-100 font-semibold">Total</p>
                    <p className="font-bold text-white">
                      Tsh {myMember.totalContribution.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                  title="Expected contribution amount"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c1.38 0 2.5 1.12 2.5 2.5S13.38 13 12 13s-2.5-1.12-2.5-2.5S10.62 8 12 8z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 13v5m0-5a5 5 0 015-5v5m-10 0a5 5 0 015-5v5"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-400 font-semibold">Expected</p>
                    <p className="font-bold text-amber-400">
                      Tsh {myMember.expectedContribution.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                  title="Remaining balance to reach expected contribution"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-2M7 13h.01"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-red-400 font-semibold">Remaining</p>
                    <p className="font-bold text-red-400">
                      Tsh {myMember.remainingBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress circle */}
              <div className="mt-6 flex items-center gap-4">
                <svg className="w-12 h-12">
                  <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="4" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={
                      myMember.expectedContribution
                        ? 125.6 - 125.6 * (myMember.totalContribution / myMember.expectedContribution)
                        : 125.6
                    }
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Contribution Progress</p>
                  <p className="text-lg font-semibold text-yellow-300">
                    {myMember.expectedContribution
                      ? ((myMember.totalContribution / myMember.expectedContribution) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Totals Section with badges/icons and updated colors */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Total Group Balance
        </h2>
        <div className="relative overflow-hidden rounded-2xl border border-green-500 bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-6 shadow-xl text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 rounded-full bg-green-600 opacity-10 blur-3xl z-0" />
          <div className="relative z-10 space-y-6">

            <div className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform" title="Total contributions collected so far">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth={2} />
              </svg>
              <div>
                <p className="text-sm text-green-300 font-semibold">Total Collected</p>
                <p className="text-3xl font-bold">Tsh {groupTotals.totalActual.toLocaleString()}</p>
                <p className="text-sm">of Tsh {groupTotals.totalExpected.toLocaleString()} expected</p>
              </div>
            </div>

            <div className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform" title="Percentage of total expected contributions collected">
              <svg className="w-16 h-16">
                <circle cx="24" cy="24" r="20" stroke="#14532d" strokeWidth="4" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeDasharray="125.6"
                  strokeDashoffset={
                    groupTotals.totalExpected
                      ? 125.6 - 125.6 * (groupTotals.totalActual / groupTotals.totalExpected)
                      : 125.6
                  }
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <div>
                <p className="text-sm text-green-300 font-semibold">Progress</p>
                <p className="text-lg font-bold text-green-300">
                  {groupTotals.totalExpected
                    ? ((groupTotals.totalActual / groupTotals.totalExpected) * 100).toFixed(1)
                    : "0.0"}
                  %
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" title="Total expenses incurred by the group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m2 6v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m14-6h-2a4 4 0 00-4 4v2" />
                </svg>
                <div>
                  <p className="text-green-200 font-semibold">Expenses</p>
                  <p className="font-bold text-orange-600">Tsh {groupTotals.expenses.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" title="Remaining balance (Total balance minus expenses)">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-2M7 13h.01" />
                </svg>
                <div>
                  <p className="text-green-200 font-semibold">Remaining Balance</p>
                  <p className="font-bold text-red-400">Tsh {(groupTotals.totalBalance - groupTotals.expenses).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-white/70 mt-4">
              {groupTotals.memberCount > 0 ? groupTotals.memberCount - 1 : 0} members total
            </p>
          </div>
        </div>
      </div>

      {/* Top Contributors Section */}
      {rankedMembers.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Top Contributors
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {rankedMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full sm:w-1/3"
              >
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-10 h-10 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center">
                    {member.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{member.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tsh {member.totalContribution.toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-yellow-300">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Members Section */}
      {otherMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherMembers.map((member) => (
            <MemberCard
              key={member.id}
              fullName={member.fullName}
              totalContribution={member.totalContribution}
              expectedContribution={member.expectedContribution}
              remainingBalance={member.remainingBalance}
            />
          ))}
        </div>
      ) : (
        !myMember && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No contribution data found for your account.
          </p>
        )
      )}

      <footer className="mt-16 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <div className="text-[11px] text-gray-400 dark:text-gray-500">
          Designed by{" "}
          <a
            href="https://pktechnologies.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Pk Technologies Ltd.
          </a>
        </div>
      </footer>

      <Analytics />
    </>
  );
};

export default Index;
