// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import UserHeader from "@/components/UserHeader";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <UserHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
