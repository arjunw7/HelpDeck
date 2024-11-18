"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PLANS } from "@/lib/paddle";
import { usePaddlePrices } from "@/hooks/use-paddle-prices";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { initializePaddle } from '@paddle/paddle-js';
import { Skeleton } from "@/components/ui/skeleton";

export default function PricingPage() {
  const router = useRouter();
  const { user, organization } = useAuth();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { monthly: monthlyPrices, yearly: yearlyPrices, isLoading: isPricesLoading, error: pricesError } = usePaddlePrices();

  const token = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox' 
    ? process.env.NEXT_PUBLIC_PADDLE_SANDBOX_WEBHOOK_SECRET 
    : process.env.PADDLE_PRODUCTION_WEBHOOK_SECRET;
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';

  const handlePlanSelect = async (plan: typeof PLANS[0]) => {
    if (!user) {
      router.push(`/auth?redirectTo=${encodeURIComponent('/pricing')}`);
      return;
    }

    if (!organization) {
      toast.error("Organization not found");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const paddle = await initializePaddle({ 
        environment, 
        token,
      });
      
      const priceId = plan.priceIds[environment][billingInterval];
      await paddle?.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: {
          email: user.email,
        },
        custom_data: {
          org_id: organization.id
        },
        settings: {
          successUrl: `${window.location.origin}/subscription/success`,
          displayMode: 'inline',
          theme: 'light',
        }
      });
    } catch (error) {
      console.error("Error opening checkout:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const getPriceForPlan = (plan: typeof PLANS[0]) => {
    const priceId = plan.priceIds[environment][billingInterval];
    const prices = billingInterval === "monthly" ? monthlyPrices : yearlyPrices;
    return prices[priceId]?.price?.unitPrice || null;
  };

  // Filter plans that have available prices
  const availablePlans = PLANS.filter(plan => {
    const price = getPriceForPlan(plan);
    return price !== null;
  });

  if (isPricesLoading) {
    return (
      <div className="container py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-5 w-64 mx-auto mb-8" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-8">
                  <Skeleton className="h-10 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (pricesError) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Unable to load pricing information</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Choose the perfect plan for your team
        </p>

        <div className="flex justify-center mb-8">
          <ToggleGroup
            type="single"
            value={billingInterval}
            onValueChange={(value) => value && setBillingInterval(value as "monthly" | "yearly")}
            className="inline-flex items-center bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="monthly"
              className="px-6 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yearly"
              className="px-6 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              Yearly
              <span className="ml-2 text-xs text-emerald-600 font-medium">Save up to 35%</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan) => {
          const price = getPriceForPlan(plan);

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${Number(price)?.toFixed(2)}</span>
                    <span className="text-muted-foreground">/{billingInterval}</span>
                  </div>
                  {billingInterval === "yearly" && (
                    <p className="mt-1 text-sm text-green-500">
                      Save {Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)}% with yearly billing
                    </p>
                  )}
                </div>
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? "Processing..." : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}