"use client";

import { SideMenu } from "@/components/knowledge-base/side-menu";
import { usePathname } from "next/navigation";

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCustomizePage = pathname === "/knowledge-base/customize";

  return (
    <div className={`flex h-[calc(100vh-3.5rem)] ${isCustomizePage ? '' : 'mx-[5%]'}`}>
      {!isCustomizePage && <SideMenu />}
      <main className="flex-1 overflow-y-auto">
        <div className="pt-4">{children}</div>
      </main>
    </div>
  );
}