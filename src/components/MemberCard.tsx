import { Card, CardContent } from "@/components/ui/card";
import { FaUser } from "react-icons/fa";

interface MemberCardProps {
  fullName: string;
  totalContribution: number;
  expectedContribution: number;
  remainingBalance: number;
}

export const MemberCard = ({
  fullName,
  totalContribution,
  expectedContribution,
  remainingBalance,
}: MemberCardProps) => {
  const percent = expectedContribution
    ? ((totalContribution / expectedContribution) * 100).toFixed(1)
    : "0";

  const status =
    totalContribution === 0
      ? "No Payment"
      : totalContribution < expectedContribution
      ? "Partial Payment"
      : "Fully Paid";

  const statusColor =
    status === "Fully Paid"
      ? "bg-green-200 text-green-700"
      : status === "Partial Payment"
      ? "bg-yellow-200 text-yellow-700"
      : "bg-red-200 text-red-700";

  return (
    <Card className="hover:shadow-md transition bg-white dark:bg-gray-800">
      <CardContent className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <FaUser />
            <h3 className="font-semibold">{fullName}</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-3 text-center mt-4 gap-2 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-blue-600 font-bold dark:text-blue-300">
              Tsh {totalContribution.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Expected</p>
            <p className="text-orange-600 font-bold dark:text-orange-300">
              Tsh {expectedContribution.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Remaining</p>
            <p className="text-red-600 font-bold dark:text-red-300">
              Tsh {remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-center text-gray-600 dark:text-gray-400">
            {percent}% of expected contribution
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
