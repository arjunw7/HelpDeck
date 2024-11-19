"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart2,
  FolderOpen,
  FileText,
  Paintbrush,
  Plus,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { CategoryModal } from "@/components/categories/category-modal";
import { useCategories } from "@/hooks/use-categories";
import { useState } from "react";
import { useAuth } from "../auth-provider";
import { usePlanLimits } from "@/hooks/use-plan.limits";
import { toast } from "sonner";
import { useArticles } from "@/hooks/use-articles";
import { useUserPermissions } from "@/hooks/use-user-permissions";

const menuItems = (canCustomize: boolean) => [
  {
    title: "Analytics",
    icon: BarChart2,
    href: "/knowledge-base",
    disabled: false,
  },
  {
    title: "Categories",
    icon: FolderOpen,
    href: "/knowledge-base/categories",
    disabled: false,
  },
  {
    title: "Articles",
    icon: FileText,
    href: "/knowledge-base/articles",
    disabled: false,
  },
  {
    title: "Customize",
    icon: Paintbrush,
    href: "/knowledge-base/customize",
    matchPaths: ["/knowledge-base/customize", "/knowledge-base/customize/preview"],
    disabled: !canCustomize,
  },
  {
    title: "Domain & SEO",
    icon: Globe,
    href: "/knowledge-base/domain-seo",
    disabled: !canCustomize,
  },
];

export function SideMenu() {
  const pathname = usePathname();
  const { user, organization } = useAuth();
  const { categories } = useCategories(organization?.id);
  const { articles } = useArticles(organization?.id);
  const { canCustomize } = useUserPermissions();
  const router = useRouter();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { articleLimit, isWithinArticleLimit } = usePlanLimits();
  const isActiveRoute = (item: typeof menuItems[0]) => {
    if (item.matchPaths) {
      return item.matchPaths.some(path => pathname.startsWith(path));
    }
    return pathname === item.href;
  };

  const createNewArticle = () => {
    if (!isWithinArticleLimit(articles.length + 1)) {
      toast.error(`You've reached the maximum article limit (${articleLimit}) for your plan`);
      return;
    }
    else router.push('/knowledge-base/articles/new');
  }

  return (
    <div className="flex h-full w-[240px] flex-col border-r">
      <ScrollArea className="flex-1 pr-3 py-4">
        <div className="space-y-2">
          <div className="flex gap-2">
              <Button
                size="sm"
                className="w-full justify-start"
                onClick={() => createNewArticle()}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="w-full justify-start"
              variant="outline"
              onClick={() => setShowCategoryModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
          <div className="my-4 border-t" />
          {menuItems(canCustomize).map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);
            return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-muted font-medium"
                  )}
                  onClick={() => router.push(item?.href)}
                  disabled={item?.disabled}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
            );
          })}
        </div>
      </ScrollArea>

      <CategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        categories={categories}
      />
    </div>
  );
}