
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface GroupSummaryProps {
  totalBalance: number;
  totalExpected: number;
  totalActual: number;
  memberCount: number;
}

export function GroupSummary({ totalBalance, totalExpected, totalActual, memberCount }: GroupSummaryProps) {
  const completionPercentage = totalExpected > 0 ? (totalActual / totalExpected) * 100 : 0;
  const remainingAmount = totalExpected - totalActual;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total Group Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">Tsh {totalBalance.toLocaleString()}</div>
          <p className="text-xs text-blue-700 mt-1">Current contributions collected</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{completionPercentage.toFixed(1)}%</div>
          <p className="text-xs text-green-700 mt-1">
            Tsh {totalActual.toLocaleString()} of Tsh {totalExpected.toLocaleString()} collected
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Remaining</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">Tsh {remainingAmount.toLocaleString()}</div>
          <p className="text-xs text-purple-700 mt-1">
            {memberCount} members total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
