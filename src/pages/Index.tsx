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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("contributions")
        .select("*");

      if (error) {
        console.error("Error fetching contributions:", error);
        setMembers([]);
        return;
      }

      setMembers(data as Member[]);
    }

    fetchUserData();
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

  const totalExpected = numericMembers.reduce((sum, m) => sum + m.expectedContribution, 0);
  const totalActual = numericMembers.reduce((sum, m) => sum + m.totalContribution, 0);
  const totalBalance = totalActual;
  const memberCount = numericMembers.length;

  const rankedMembers = [...otherMembers]
    .sort((a, b) => b.totalContribution - a.totalContribution)
    .slice(0, 3);

  return (
    <>
      {/* Summary Section */}
      <GroupSummary
        totalBalance={totalBalance}
        totalExpected={totalExpected}
        totalActual={totalActual}
        memberCount={memberCount}
      />

      {/* My Contribution Card */}
      {myMember && (
        <div className="mb-8 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">My Contributions</h2>

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
                Total: <span className="font-bold text-white">Tsh {myMember.totalContribution.toLocaleString()}</span>
              </div>
              <div className="text-sm text-blue-100">
                Expected: <span className="font-bold text-yellow-300">Tsh {myMember.expectedContribution.toLocaleString()}</span>
              </div>
              <div className="text-sm text-blue-100">
                Remaining: <span className="font-bold text-red-300">Tsh {myMember.remainingBalance.toLocaleString()}</span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <svg className="w-12 h-12">
                  <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="4" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#facc15"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={
                      125.6 -
                      (125.6 * (myMember.totalContribution / myMember.expectedContribution))
                    }
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Contribution Progress</p>
                  <p className="text-lg font-semibold text-yellow-300">
                    {((myMember.totalContribution / myMember.expectedContribution) * 100).toFixed(1)}%
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Top Contributors</h2>
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

                <span className="text-sm font-bold text-blue-600 dark:text-yellow-300">#{index + 1}</span>
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
    </>
  );
};

export default Index;
