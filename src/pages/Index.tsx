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

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1IzawdScMCspX5y9JUf85f45-paSKq_EiDMTtqDm11OY/Sheet13")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched members:", data);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lwandai Association Financial Summary</h1>
          <p className="text-lg text-muted-foreground">Contributions and balances for all group members</p>
        </div>

        {/* Group Summary */}
        <GroupSummary
          totalBalance={totalBalance}
          totalExpected={totalExpected}
          totalActual={totalActual}
          memberCount={memberCount}
        />

        {/* Member Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Member Contributions</h2>
          <p className="text-muted-foreground mb-6">Individual contribution status and remaining balances</p>
          <MemberSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Member Cards */}
      {/* Member Cards (only show after search) */}
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
  <p className="text-center text-gray-500">Search to view individual contributions.</p>
)}

           {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        Designed by <span className="font-semibold text-gray-700">Peter Kiama</span>
      </div>
  
      </div>
    </div>
  );
};

export default Index;
