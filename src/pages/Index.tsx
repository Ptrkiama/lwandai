import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberCard } from "@/components/MemberCard";
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "@/lib/supabaseClient";

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
    memberCount: 0,
  });

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    async function fetchData() {
      // 1. Check user auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);

      // 2. Fetch members from contributions table
      const { data: memberData, error: memberError } = await supabase
        .from("contributions")
        .select("*");

      if (memberError) {
        console.error("Error fetching contributions:", memberError);
        setMembers([]);
      } else {
        setMembers(memberData as Member[]);
      }

      // 3. Fetch group totals from separate table
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
          memberCount: groupData.member_count || 0,
        });
      }
    }

    fetchData();
  }, [navigate]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
      {/* Summary Section */}
      <GroupSummary
        totalBalance={groupTotals.totalBalance}
        totalExpected={groupTotals.totalExpected}
        totalActual={groupTotals.totalActual}
        memberCount={groupTotals.memberCount}
      />

      {/* My Contribution Card */}
      {myMember && (
        <div className="mb-8 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            My Contributions
          </h2>

          <div className="relative overflow-hidden rounded-2xl border border-blue-500 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-6 shadow-xl text-white">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 rounded-full bg-blue-500 opacity-10 blur-3xl z-0"></div>

            <div className="relative z-10 space-y-2">
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

              <div className="text-sm text-blue-100">
                Total:{" "}
                <span className="font-bold text-white">
                  Tsh {myMember.totalContribution.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-blue-100">
                Expected:{" "}
                <span className="font-bold text-yellow-300">
                  Tsh {myMember.expectedContribution.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-blue-100">
                Remaining:{" "}
                <span className="font-bold text-red-300">
                  Tsh {myMember.remainingBalance.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <svg className="w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#334155"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#facc15"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={
                      125.6 -
                      (125.6 *
                        (myMember.totalContribution /
                          myMember.expectedContribution))
                    }
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Contribution Progress</p>
                  <p className="text-lg font-semibold text-yellow-300">
                    {(
                      (myMember.totalContribution /
                        myMember.expectedContribution) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Contributors */}
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

      {/* All Other Members */}
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

      {/* Footer */}
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

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around items-center sm:hidden">
        <button
          onClick={toggleDarkMode}
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-9h-1M4.34 12H3m15.07 6.07l-.71-.71M5.64 6.64l-.71-.71m12.02 0l-.71.71M5.64 17.36l-.71.71M12 5a7 7 0 000 14a7 7 0 000-14z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 0111.21 3a7 7 0 108.49 8.49z"
              />
            </svg>
          )}
          <span>{darkMode ? "Light" : "Dark"}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-sm text-red-600 dark:text-red-400"
          aria-label="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a9 9 0 110-18"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Index;
