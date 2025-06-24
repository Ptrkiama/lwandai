import { Card, CardContent } from "@/components/ui/card";
import { FaMoneyBill, FaChartLine, FaUsers } from "react-icons/fa";

interface GroupSummaryProps {
  totalBalance: number;
  totalExpected: number;
  totalActual: number;
  memberCount: number;
}

export const GroupSummary = ({
  totalBalance,
  totalExpected,
  totalActual,
  memberCount,
}: GroupSummaryProps) => {
  const progress = Math.min((totalActual / totalExpected) * 100, 100).toFixed(1);
  const remaining = totalExpected - totalActual;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance */}
      <Card className="bg-blue-100 dark:bg-blue-900 hover:shadow-lg transition">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
            <FaMoneyBill className="text-xl" />
            <h3 className="text-sm font-semibold uppercase">Total Group Balance</h3>
          </div>
          <p className="text-2xl font-bold mt-2">Tsh {totalBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Current contributions collected
          </p>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="bg-green-100 dark:bg-green-900 hover:shadow-lg transition">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-green-800 dark:text-green-300">
            <FaChartLine className="text-xl" />
            <h3 className="text-sm font-semibold uppercase">Progress</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{progress}%</p>
          <p className="text-sm mt-1">
            Tsh {totalActual.toLocaleString()} of Tsh {totalExpected.toLocaleString()} collected
          </p>
          <div className="w-full h-2 mt-3 bg-green-200 dark:bg-green-700 rounded-full">
            <div
              className="h-full bg-green-600 dark:bg-green-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Remaining */}
      <Card className="bg-purple-100 dark:bg-purple-900 hover:shadow-lg transition">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-purple-800 dark:text-purple-300">
            <FaUsers className="text-xl" />
            <h3 className="text-sm font-semibold uppercase">Remaining</h3>
          </div>
          <p className="text-2xl font-bold mt-2">Tsh {remaining.toLocaleString()}</p>
          <p className="text-sm mt-1">{memberCount} member{memberCount !== 1 && "s"} total</p>
        </CardContent>
      </Card>
    </div>
  );
};
