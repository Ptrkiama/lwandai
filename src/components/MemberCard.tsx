
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface MemberCardProps {
  fullName: string;
  totalContribution: number;
  remainingBalance: number;
  expectedContribution: number;
}

export function MemberCard({ fullName, totalContribution, remainingBalance, expectedContribution }: MemberCardProps) {
  const isPaidInFull = remainingBalance <= 0;
  const isPartiallyPaid = totalContribution > 0 && remainingBalance > 0;
  const isNotPaid = totalContribution === 0;

  const getStatusIcon = () => {
    if (isPaidInFull) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isPartiallyPaid) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusBadge = () => {
    if (isPaidInFull) return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Paid in Full</Badge>;
    if (isPartiallyPaid) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Partial Payment</Badge>;
    return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Not Paid</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{fullName}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Contribution</p>
            <p className="text-xl font-bold text-blue-700">Tsh {totalContribution.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Expected</p>
            <p className="text-xl font-bold text-orange-700">Tsh {expectedContribution.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Remaining Balance</p>
            <p className="text-xl font-bold text-red-700">
              {remainingBalance > 0 ? `Tsh ${remainingBalance.toLocaleString()}` : '$0'}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalContribution / expectedContribution) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {((totalContribution / expectedContribution) * 100).toFixed(1)}% of expected contribution
        </p>
      </CardContent>
    </Card>
  );
}
