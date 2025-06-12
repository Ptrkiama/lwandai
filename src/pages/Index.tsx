import { useEffect, useState } from "react";
import { GroupSummary } from "@/components/GroupSummary";
import { MemberCard } from "@/components/MemberCard";
import { MemberSearch } from "@/components/MemberSearch";

interface Member {
  name: string;
  contributed: string;
  expected: string;
}

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved dark mode preference or use time-based default
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

  // Apply/remove dark class and add transition class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark-mode-transition");
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch members data
  useEffect(() => {
    fetch("https://opensheet.elk.sh/1IzawdScMCspX5y9JUf85f45-paSKq_EiDMTtqDm11OY/Sheet13")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        console.error("Failed to fetch members:", error);
      });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
                    text-gray-900 dark:text-gray-100 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-4 py-8">

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
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
            Lwandai Friends Association
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
            Financial Summary Dashboard
          </p>
          <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
        </header>

        {/* Group Summary */}
        <GroupSummary
          totalBalance={totalBalance}
          totalExpected={totalExpected}
          totalActual={totalActual}
          memberCount={memberCount}
        />

        {/* Member Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Member Contributions
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            Individual contribution status and remaining balances
          </p>
          <MemberSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Member Cards */}
        {searchTerm.trim() !== "" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Designed by <span className="font-semibold text-gray-700 dark:text-white">Peter Kiama</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
