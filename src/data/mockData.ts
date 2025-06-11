
export interface Member {
  id: string;
  fullName: string;
  totalContribution: number;
  expectedContribution: number;
}

export const mockMembers: Member[] = [
  {
    id: "1",
    fullName: "Sarah Johnson",
    totalContribution: 500,
    expectedContribution: 500,
  },
  {
    id: "2",
    fullName: "Michael Chen",
    totalContribution: 300,
    expectedContribution: 500,
  },
  {
    id: "3",
    fullName: "Emily Rodriguez",
    totalContribution: 500,
    expectedContribution: 500,
  },
  {
    id: "4",
    fullName: "David Thompson",
    totalContribution: 0,
    expectedContribution: 500,
  },
  {
    id: "5",
    fullName: "Lisa Anderson",
    totalContribution: 450,
    expectedContribution: 500,
  },
  {
    id: "6",
    fullName: "James Wilson",
    totalContribution: 500,
    expectedContribution: 500,
  },
  {
    id: "7",
    fullName: "Maria Garcia",
    totalContribution: 200,
    expectedContribution: 500,
  },
  {
    id: "8",
    fullName: "Robert Lee",
    totalContribution: 500,
    expectedContribution: 500,
  },
];

export function calculateGroupStats(members: Member[]) {
  const totalActual = members.reduce((sum, member) => sum + member.totalContribution, 0);
  const totalExpected = members.reduce((sum, member) => sum + member.expectedContribution, 0);
  const totalRemaining = totalExpected - totalActual;
  
  return {
    totalBalance: totalActual,
    totalExpected,
    totalActual,
    totalRemaining,
    memberCount: members.length,
  };
}
