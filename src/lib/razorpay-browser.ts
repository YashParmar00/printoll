let pending: Promise<boolean> | undefined;
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ("Razorpay" in window) return Promise.resolve(true);
  if (pending) return pending;
  pending = new Promise<boolean>(resolve => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    const timer = window.setTimeout(() => finish(false), 20_000);
    function finish(ok: boolean) {
      window.clearTimeout(timer);
      script.onload = script.onerror = null;
      if (!ok) { script.remove(); pending = undefined; }
      resolve(ok);
    }
    script.onload = () => finish("Razorpay" in window);
    script.onerror = () => finish(false);
    document.body.appendChild(script);
  });
  return pending;
}
