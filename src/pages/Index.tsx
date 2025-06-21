import { useEffect, useState } from "react";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberCard } from "@/components/MemberCard";
import { MemberSearch } from "@/components/MemberSearch";
import { Analytics } from "@vercel/analytics/react";

interface Member {
  name: string;
  contributed: string;
  expected: string;
}

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setIsDarkMode(savedMode === "true");
    } else {
      const hour = new Date().getHours();
      const isNightTime = hour < 6 || hour >= 18;
      setIsDarkMode(isNightTime);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark-mode-transition");
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1IzawdScMCspX5y9JUf85f45-paSKq_EiDMTtqDm11OY/Website_data")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error("Failed to fetch members:", error));
  }, []);

  const numericMembers = members.map((m, i) => ({
    id: i,
    fullName: m.name,
    totalContribution: parseFloat(m.contributed) || 0,
    expectedContribution: parseFloat(m.expected) || 0,
    remainingBalance: Math.max(0, (parseFloat(m.expected) || 0) - (parseFloat(m.contributed) || 0)),
  }));

  const filteredMembers = numericMembers.filter((member) =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpected = numericMembers.reduce((sum, m) => sum + m.expectedContribution, 0);
  const totalActual = numericMembers.reduce((sum, m) => sum + m.totalContribution, 0);
  const totalBalance = totalActual;
  const memberCount = numericMembers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              localStorage.setItem("darkMode", String(newMode));
            }}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-10 py-6 px-4 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Lwandai Friends Association
          </h1>

          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
          </div>
        </header>

        {/* Group Summary */}
        <GroupSummary
          totalBalance={totalBalance}
          totalExpected={totalExpected}
          totalActual={totalActual}
          memberCount={memberCount}
        />

        {/* Member Section */}
        <section className="mb-8 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Member Contributions
          </h2>

          <MemberSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </section>

        {/* Member Cards */}
        {searchTerm.trim() !== "" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
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
          <p className="text-center text-gray-500 dark:text-gray-400">
            Search to view your contributions.
          </p>
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
      </div>

      {/* Analytics */}
      <Analytics />
    </div>
  );
};

export default Index;
