declare module '@paddle/paddle-js' {
  export enum Environment {
    sandbox = 'sandbox',
    production = 'production'
  }

  export enum LogLevel {
    error = 'error',
    warn = 'warn',
    info = 'info',
    http = 'http',
    verbose = 'verbose',
    debug = 'debug',
    silly = 'silly'
  }

  export interface PaddleCheckoutSettings {
    displayMode?: 'inline' | 'overlay';
    theme?: 'light' | 'dark';
    locale?: string;
    successUrl?: string;
    closeUrl?: string;
    frameTarget?: string;
    frameStyle?: string;
    frameInitialHeight?: number;
  }

  export interface PaddleCheckoutItem {
    priceId: string;
    quantity?: number;
  }

  export interface PaddleCheckoutProps {
    items: PaddleCheckoutItem[];
    settings?: PaddleCheckoutSettings;
    custom_data?: Record<string, any>;
    customer?: {
      email?: string;
      [key: string]: any;
    };
  }

  export interface PaddleCheckout {
    open: (props: PaddleCheckoutProps) => Promise<void>;
  }

  export interface PaddleEventCallback {
    name: string;
    data?: any;
  }

  export interface PricePreviewItem {
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
    formattedTotals: {
      total: string;
    };
  }

  export interface PricePreviewResponse {
    data: {
      details: {
        lineItems: PricePreviewItem[];
      };
    };
  }

  export interface PaddleInitializeOptions {
    environment?: 'sandbox' | 'production';
    token?: string;
    checkout?: {
      settings?: PaddleCheckoutSettings;
      eventCallback?: (data: PaddleEventCallback) => void;
    };
  }

  export interface Paddle {
    Checkout: PaddleCheckout;
    Environment: {
      sandbox: 'sandbox';
      production: 'production';
    };
    PricePreview: (props: { items: PaddleCheckoutItem[] }) => Promise<PricePreviewResponse>;
  }

  export function initializePaddle(options: PaddleInitializeOptions): Promise<Paddle>;
}

// Extend the global Window interface
declare global {
  interface Window {
    Paddle?: Paddle;
  }
}