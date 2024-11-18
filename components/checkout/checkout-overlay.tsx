"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Paddle } from '@paddle/paddle-js';

interface CheckoutOverlayProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  interval: "monthly" | "yearly";
  paddle?: Paddle;
  selectedPriceId: string;
}

export function CheckoutOverlay({ 
  open, 
  onClose,
  planName,
  planPrice,
  interval,
  paddle,
  selectedPriceId,
}: CheckoutOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      hasInitialized.current = false;
    };
  }, []);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!mounted || !containerRef.current || !paddle || !selectedPriceId || hasInitialized.current) {
        return;
      }

      try {
        hasInitialized.current = true;

        // Create a unique ID for the checkout container
        const containerId = `checkout-container-${Date.now()}`;
        containerRef.current.id = containerId;

        await paddle.Checkout.open({
          items: [{ priceId: selectedPriceId, quantity: 1 }],
          settings: {
            frameTarget: `#${containerId}`,
            frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
            frameInitialHeight: 450,
            displayMode: "inline",
          },
        });
      } catch (error) {
        console.error("Error opening checkout:", error);
        toast.error("Failed to start checkout process");
        onClose();
      }
    };

    // Small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      initializeCheckout();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [mounted, paddle, selectedPriceId, onClose]);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex h-full w-full flex-col overflow-hidden bg-background">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="text-lg font-semibold">Checkout</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Left Column - Checkout Form */}
            <div className="flex-1 border-r">
              <div ref={containerRef} className="h-full" />
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-[400px] bg-muted/50">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    
                    {/* Item */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{planName}</div>
                          <div className="text-sm text-muted-foreground">
                            Billed {interval}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${planPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${planPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <div className="text-right">
                      <div>${planPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {interval === "yearly" ? "per year" : "per month"}
                      </div>
                    </div>
                  </div>

                  {/* Discounts Section */}
                  {interval === "yearly" && (
                    <div className="mt-6 rounded-lg bg-primary/10 p-4">
                      <div className="font-medium text-primary">Yearly Discount Applied</div>
                      <p className="text-sm text-primary/80">
                        Save up to 30% with annual billing
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}