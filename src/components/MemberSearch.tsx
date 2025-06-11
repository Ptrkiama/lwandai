
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MemberSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MemberSearch({ searchTerm, onSearchChange }: MemberSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search members by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
