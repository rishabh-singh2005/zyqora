import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Check, Crown, Star } from "lucide-react";
import Button from "../common/Button";
import { getPlans, purchasePlan, verifyPlanPayment, getMyPlan } from "../../api/plan.api";

const DURATION_LABELS = {
  ONE_HOUR: "1 Hour",
  SIX_HOURS: "6 Hours",
  TWELVE_HOURS: "12 Hours",
};

const PLAN_STYLES = {
  FREE: { icon: Star, gradient: "from-gray-100 to-gray-50", accent: "text-gray-600" },
  SILVER: { icon: Star, gradient: "from-primary-100 to-primary-50", accent: "text-primary-600" },
  GOLD: { icon: Crown, gradient: "from-accent-300 to-secondary-300", accent: "text-white" },
};

export default function PricingPlans() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState(null);
  const [myPlan, setMyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlans().then((res) => setPlans(res.plans));
    if (isAuthenticated) {
      getMyPlan().then((res) => setMyPlan(res.plan));
    }
    setLoading(false);
  }, [isAuthenticated]);

  const handlePurchase = async (planType, duration) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    setError("");
    setPurchasing(`${planType}-${duration}`);

    try {
      const res = await purchasePlan({ planType, duration });

      const options = {
        key: res.keyId,
        amount: res.amount,
        currency: res.currency,
        name: "Zyqora",
        description: `${planType} Plan - ${DURATION_LABELS[duration]}`,
        order_id: res.razorpayOrderId,
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#7C3AED" },
        handler: async (response) => {
          try {
            await verifyPlanPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planType,
              duration,
            });
            const myPlanRes = await getMyPlan();
            setMyPlan(myPlanRes.plan);
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed");
          } finally {
            setPurchasing(null);
          }
        },
        modal: {
          ondismiss: () => setPurchasing(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate purchase");
      setPurchasing(null);
    }
  };

  if (loading || !plans) {
    return <p className="text-center py-10 text-muted font-body">Loading plans...</p>;
  }

  return (
    <div>
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-3xl font-display font-bold text-ink">Choose Your Plan</h2>
        <p className="text-muted font-body">Unlock premium perks for a limited time window</p>
      </div>

      {myPlan?.planType && myPlan.planType !== "FREE" && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl2 shadow-soft p-5 mb-8 text-center">
          <p className="font-display font-semibold">
            You have an active <strong>{myPlan.planType}</strong> plan
          </p>
          <p className="text-sm opacity-90 font-body mt-1">
            Expires on {new Date(myPlan.expiresAt).toLocaleString("en-IN")}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-6 text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {["FREE", "SILVER", "GOLD"].map((planType) => {
          const style = PLAN_STYLES[planType];
          const Icon = style.icon;
          const isGold = planType === "GOLD";

          return (
            <div
              key={planType}
              className={`rounded-xl2 shadow-card p-6 space-y-4 bg-gradient-to-br ${style.gradient} ${
                isGold ? "text-white shadow-card-hover md:scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={22} className={isGold ? "text-white" : style.accent} />
                <h3 className="font-display font-bold text-xl">{planType}</h3>
              </div>

              {planType === "FREE" ? (
                <>
                  <p className={`text-sm font-body ${isGold ? "text-white/90" : "text-muted"}`}>
                    Basic access, always free
                  </p>
                  <ul className="space-y-2 text-sm font-body">
                    <li className="flex items-center gap-2">
                      <Check size={14} /> Browse & purchase products
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} /> Standard support
                    </li>
                  </ul>
                </>
              ) : (
                <div className="space-y-3">
                  {Object.entries(plans[planType].price).map(([duration, price]) => (
                    <div
                      key={duration}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        isGold ? "bg-white/15" : "bg-white/70"
                      }`}
                    >
                      <div>
                        <p className="font-display font-semibold text-sm">
                          {DURATION_LABELS[duration]}
                        </p>
                        <p className={`text-xs font-body ${isGold ? "text-white/80" : "text-muted"}`}>
                          One-time access
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold">₹{price}</span>
                        <Button
                          variant={isGold ? "secondary" : "primary"}
                          className="!py-1.5 !px-4 text-xs"
                          disabled={purchasing === `${planType}-${duration}`}
                          onClick={() => handlePurchase(planType, duration)}
                        >
                          {purchasing === `${planType}-${duration}` ? "..." : "Buy"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}