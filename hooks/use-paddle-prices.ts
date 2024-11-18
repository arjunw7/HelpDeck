import { useState, useEffect } from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { PLANS } from '@/lib/paddle';

interface PricePreview {
  price: {
    id: string;
    unitPrice: {
      amount: string;
      currency_code: string;
    };
    description: string;
    name: string;
  };
  totals: {
    total: string;
  };
  formatted_totals: {
    total: string;
  };
}

interface PaddlePrices {
  monthly: Record<string, PricePreview>;
  yearly: Record<string, PricePreview>;
  isLoading: boolean;
  error: Error | null;
}

export function usePaddlePrices() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [prices, setPrices] = useState<PaddlePrices>({
    monthly: {},
    yearly: {},
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
    const token = environment === 'sandbox' 
      ? process.env.NEXT_PUBLIC_PADDLE_SANDBOX_WEBHOOK_SECRET 
      : process.env.NEXT_PUBLIC_PADDLE_PRODUCTION_WEBHOOK_SECRET;

    if (!token) {
      setPrices(prev => ({ ...prev, error: new Error('Missing Paddle client token'), isLoading: false }));
      return;
    }

    async function initializePaddleAndFetchPrices() {
      try {
        const paddleInstance = await initializePaddle({ 
          environment, 
          token,
        });
        setPaddle(paddleInstance);

        // Get price IDs for the current environment
        const monthlyPriceIds = PLANS.map(plan => plan.priceIds[environment].monthly);
        const yearlyPriceIds = PLANS.map(plan => plan.priceIds[environment].yearly);

        // Fetch monthly prices
        const monthlyResponse = await paddleInstance.PricePreview({
          items: monthlyPriceIds.map(priceId => ({ priceId, quantity: 1 }))
        });

        // Fetch yearly prices
        const yearlyResponse = await paddleInstance.PricePreview({
          items: yearlyPriceIds.map(priceId => ({ priceId, quantity: 1 }))
        });

        // Process monthly prices
        const monthlyPrices = monthlyResponse.data.details.lineItems.reduce((acc, item) => ({
          ...acc,
          [item.price.id]: {
            price: {
              id: item.price.id,
              unitPrice: Number(item.price.unitPrice?.amount) / 100,
              description: item.price.description,
              name: item.price.name,
            },
            totals: item.totals,
            formatted_totals: item.formattedTotals,
          }
        }), {});

        // Process yearly prices
        const yearlyPrices = yearlyResponse.data.details.lineItems.reduce((acc, item) => ({
          ...acc,
          [item.price.id]: {
            price: {
              id: item.price.id,
              unitPrice: Number(item.price.unitPrice?.amount) / 100,
              description: item.price.description,
              name: item.price.name,
            },
            totals: item.totals,
            formatted_totals: item.formattedTotals,
          }
        }), {});

        setPrices({
          monthly: monthlyPrices,
          yearly: yearlyPrices,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.log('error in pricing', error);
        setPrices(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Failed to fetch prices'),
          isLoading: false,
        }));
      }
    }

    initializePaddleAndFetchPrices();
  }, []);

  return prices;
}