"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { PLANS } from "@/lib/paddle";

export function usePlanLimits() {
  const { subscription } = useSubscription();

  const getCurrentPlan = () => {
    if (!subscription?.plan_id) return null;
    if (subscription?.plan_id === "trial") return PLANS.find((plan) => plan.id === "pro")
    
    return PLANS.find(plan => 
      plan.priceIds.production.monthly === subscription.plan_id || 
      plan.priceIds.production.yearly === subscription.plan_id ||
      plan.priceIds.sandbox.monthly === subscription.plan_id ||
      plan.priceIds.sandbox.yearly === subscription.plan_id
    );
  };

  const currentPlan = getCurrentPlan();

  return {
    userLimit: currentPlan?.users || 0,
    articleLimit: currentPlan?.articleLimit || 0,
    hasChangeLogAccess: (subscription?.status === "active" && currentPlan?.id !== "starter") || subscription?.plan_id === "trial",
    isWithinUserLimit: (currentUsers: number) => {
      if (!currentPlan) return false;
      return currentPlan.users === "Unlimited" || currentUsers < currentPlan.users;
    },
    isWithinArticleLimit: (currentArticles: number) => {
      if (!currentPlan) return false;
      return currentPlan.articleLimit === "Unlimited" || currentArticles < currentPlan.articleLimit;
    }
  };
}