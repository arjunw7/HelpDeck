"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { PricingModal } from "@/components/pricing-modal";
import { useState } from "react";

interface UpgradePlanOverlayProps {
  message: string;
}

export function UpgradePlanOverlay({ message }: UpgradePlanOverlayProps) {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm h-[100vh - 10px] mt-16">
      <div className="fixed inset-0 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Upgrade Required</h2>
          <p className="mb-6 text-muted-foreground">{message}</p>
          <Button onClick={() => setShowPricing(true)}>
            Upgrade Now
          </Button>
        </Card>
      </div>
      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </div>
  );
}