// FILE PATH: src/hooks/useFlutterwave.ts
import { useState } from "react";

interface FlutterwaveOptions {
  amount: number;
  currency: "NGN" | "CAD";
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  ref: string;
  meta?: Record<string, string>;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (options: Record<string, unknown>) => void;
  }
}

/**
 * Dynamically loads Flutterwave checkout script
 */
const loadFlutterwaveScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.FlutterwaveCheckout) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Flutterwave script"));
    document.head.appendChild(script);
  });
};

export const useFlutterwave = (options: FlutterwaveOptions) => {
  const [loading, setLoading] = useState(false);

  const initializePayment = async () => {
    if (loading) return; // Prevent double-click
    setLoading(true);

    try {
      const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Flutterwave public key is not defined in .env");
      }
      if (!options.amount || options.amount <= 0) {
        throw new Error("Invalid payment amount");
      }

      await loadFlutterwaveScript();

      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: options.ref,
        amount: options.amount,
        currency: options.currency,
        payment_options:
          options.currency === "NGN"
            ? "card, banktransfer, ussd, mobilemoney"
            : "card",
        customer: {
          email: options.customerEmail,
          name: options.customerName,
          phonenumber: options.customerPhone,
        },
        meta: options.meta || {},
        customizations: {
          title: "Xpola Store",
          description: `Order payment - ${options.currency}`,
          logo: "/logo.png",
        },
        callback: (response: {
          status: string;
          transaction_id: number;
          tx_ref: string;
        }) => {
          setLoading(false);
          if (response.status === "successful") {
            options.onSuccess(response.tx_ref);
          } else {
            console.warn("Payment not successful:", response);
          }
        },
        onclose: () => {
          setLoading(false);
          options.onClose?.();
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Flutterwave error:", error);
      alert(
        "Payment system failed to load. Please check your connection and try again."
      );
    }
  };

  return {
    initializePayment,
    loading,
  };
};
