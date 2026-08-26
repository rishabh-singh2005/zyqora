import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Crown,
  Star,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Button from "../common/Button";

import {
  getPlans,
  purchasePlan,
  verifyPlanPayment,
  getMyPlan,
} from "../../api/plan.api";

/* ==================== DURATION LABELS ==================== */

const DURATION_LABELS = {
  ONE_HOUR: "1 Hour",
  SIX_HOURS: "6 Hours",
  TWELVE_HOURS: "12 Hours",
};

/* ==================== PLAN STYLES ==================== */

const PLAN_STYLES = {
  FREE: {
    icon: Star,
    gradient: "from-gray-100 to-gray-50",
    accent: "text-gray-600",
  },

  SILVER: {
    icon: Star,
    gradient: "from-primary-100 to-primary-50",
    accent: "text-primary-600",
  },

  GOLD: {
    icon: Crown,
    gradient: "from-accent-300 to-secondary-300",
    accent: "text-white",
  },
};

/* ==================== PLAN BENEFITS ==================== */

const PLAN_BENEFITS = {
  FREE: {
    title: "Start for Free",
    subtitle: "Everything you need to get started",
    icon: Star,

    benefits: [
      "Browse all products",
      "Purchase products",
      "Wishlist access",
      "Standard customer support",
    ],
  },

  SILVER: {
    title: "More Value, More Benefits",
    subtitle: "Perfect for regular Zyqora shoppers",
    icon: ShieldCheck,

    benefits: [
      "Priority product access",
      "Exclusive member offers",
      "Faster customer support",
      "Special Silver discounts",
    ],
  },

  GOLD: {
    title: "The Premium Experience",
    subtitle: "Maximum benefits for premium shoppers",
    icon: Crown,

    benefits: [
      "Premium member discounts",
      "Early access to deals",
      "Priority customer support",
      "Exclusive Gold offers",
    ],
  },
};

/* ==================== PRICING PLANS ==================== */

export default function PricingPlans() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [plans, setPlans] = useState(null);
  const [myPlan, setMyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState("");

  /* ==================== LOAD PLANS ==================== */

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await getPlans();

        setPlans(res.plans);

        if (isAuthenticated) {
          const myPlanRes = await getMyPlan();
          setMyPlan(myPlanRes.plan);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load pricing plans"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [isAuthenticated]);

  /* ==================== PURCHASE PLAN ==================== */

  const handlePurchase = async (planType, duration) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setError("");
    setPurchasing(`${planType}-${duration}`);

    try {
      const res = await purchasePlan({
        planType,
        duration,
      });

      const options = {
        key: res.keyId,
        amount: res.amount,
        currency: res.currency,

        name: "Zyqora",

        description: `${planType} Plan - ${DURATION_LABELS[duration]}`,

        order_id: res.razorpayOrderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#7C3AED",
        },

        handler: async (response) => {
          try {
            await verifyPlanPayment({
              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,

              planType,
              duration,
            });

            const myPlanRes = await getMyPlan();

            setMyPlan(myPlanRes.plan);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setPurchasing(null);
          }
        },

        modal: {
          ondismiss: () => {
            setPurchasing(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to initiate purchase"
      );

      setPurchasing(null);
    }
  };

  /* ==================== LOADING ==================== */

  if (loading || !plans) {
    return (
      <p className="text-center py-10 text-muted font-body">
        Loading plans...
      </p>
    );
  }

  /* ==================== UI ==================== */

  return (
    <div className="relative overflow-visible">

      {/* ==================== SECTION HEADING ==================== */}

      <div className="text-center mb-12">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary-50 border border-primary-100 text-primary-600">
          <Sparkles size={14} />

          <span className="text-xs font-body font-semibold tracking-wide uppercase">
            Membership Plans
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-ink tracking-tight">
          Choose the Experience

          <span className="block text-primary-600 mt-1">
            That Fits You
          </span>
        </h2>

        <p className="max-w-xl mx-auto mt-3 text-sm md:text-base text-muted font-body leading-6">
          Unlock exclusive shopping benefits, member-only offers,
          and premium perks designed to make every Zyqora purchase
          more rewarding.
        </p>

        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="h-px w-10 bg-primary-200" />

          <Zap
            size={15}
            className="text-primary-500"
          />

          <span className="h-px w-10 bg-primary-200" />
        </div>
      </div>

      {/* ==================== ACTIVE PLAN ==================== */}

      {myPlan?.planType &&
        myPlan.planType !== "FREE" && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl2 shadow-soft p-5 mb-8 text-center">
            <p className="font-display font-semibold">
              You have an active{" "}
              <strong>{myPlan.planType}</strong> plan
            </p>

            <p className="text-sm opacity-90 font-body mt-1">
              Expires on{" "}
              {new Date(
                myPlan.expiresAt
              ).toLocaleString("en-IN")}
            </p>
          </div>
        )}

      {/* ==================== ERROR ==================== */}

      {error && (
        <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3 mb-6 text-center">
          {error}
        </div>
      )}

      {/* ==================== PRICING CARDS ==================== */}

      <div className="grid md:grid-cols-3 gap-6 overflow-visible">

        {["FREE", "SILVER", "GOLD"].map(
          (planType) => {
            const style =
              PLAN_STYLES[planType];

            const Icon = style.icon;

            const isGold =
              planType === "GOLD";

            const benefits =
              PLAN_BENEFITS[planType];

            const BenefitIcon =
              benefits.icon;

            return (
              <div
                key={planType}
                className="relative group overflow-visible"
              >

                {/* ================================================== */}
                {/* HOVER INFORMATION CARD */}
                {/* ================================================== */}

                <div
                  className={`
                    absolute z-40
                    hidden md:block
                    w-[300px]

                    opacity-0
                    invisible
                    scale-95
                    pointer-events-none

                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:scale-100

                    transition-all
                    duration-300
                    ease-out

                    ${
                      planType === "FREE"
                        ? `
                          left-[calc(100%+20px)]
                          top-1/2
                          -translate-y-1/2
                        `
                        : planType === "SILVER"
                        ? `
                          right-[calc(100%+20px)]
                          top-1/2
                          -translate-y-1/2
                        `
                        : `
                          right-[calc(100%+20px)]
                          top-1/2
                          -translate-y-1/2
                        `
                    }
                  `}
                >

                  {/* ==================== ARROW ==================== */}

                  <div
                    className={`
                      absolute
                      w-3.5
                      h-3.5
                      bg-white
                      border-primary-100
                      rotate-45

                      ${
                        planType === "FREE"
                          ? `
                            left-[-7px]
                            top-1/2
                            -translate-y-1/2
                            border-l
                            border-b
                          `
                          : `
                            right-[-7px]
                            top-1/2
                            -translate-y-1/2
                            border-r
                            border-t
                          `
                      }
                    `}
                  />

                  {/* ==================== INFORMATION CARD ==================== */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-primary-100
                      bg-white/95
                      backdrop-blur-xl
                      shadow-[0_20px_50px_rgba(80,40,140,0.18)]
                      p-5
                    "
                  >

                    {/* Decorative glow */}

                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-100/40 blur-2xl" />

                    <div className="relative">

                      {/* ==================== HEADER ==================== */}

                      <div className="flex items-center gap-3 mb-5">

                        <div
                          className={`
                            relative
                            h-11
                            w-11
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            shrink-0
                            shadow-sm

                            ${
                              planType === "GOLD"
                                ? "bg-gradient-to-br from-accent-300 to-secondary-300 text-white"
                                : planType === "SILVER"
                                ? "bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600"
                                : "bg-gray-100 text-gray-600"
                            }
                          `}
                        >
                          <BenefitIcon size={20} />
                        </div>

                        <div className="min-w-0">

                          <p
                            className={`
                              text-[10px]
                              font-body
                              font-bold
                              uppercase
                              tracking-[0.18em]

                              ${
                                planType === "GOLD"
                                  ? "text-secondary-500"
                                  : "text-primary-500"
                              }
                            `}
                          >
                            {planType} Membership
                          </p>

                          <h4 className="font-display font-bold text-base text-ink leading-tight mt-1">
                            {benefits.title}
                          </h4>

                        </div>

                      </div>

                      {/* ==================== SUBTITLE ==================== */}

                      <p className="text-xs font-body text-muted leading-5 mb-5">
                        {benefits.subtitle}
                      </p>

                      {/* ==================== BENEFITS ==================== */}

                      <div className="space-y-3">

                        {benefits.benefits.map(
                          (benefit) => (
                            <div
                              key={benefit}
                              className="flex items-center gap-2.5"
                            >

                              <div
                                className={`
                                  h-5
                                  w-5
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0

                                  ${
                                    planType ===
                                    "GOLD"
                                      ? "bg-secondary-50"
                                      : "bg-primary-50"
                                  }
                                `}
                              >
                                <Check
                                  size={11}
                                  strokeWidth={2.5}
                                  className={
                                    planType ===
                                    "GOLD"
                                      ? "text-secondary-500"
                                      : "text-primary-600"
                                  }
                                />
                              </div>

                              <span className="text-xs font-body text-ink/80 leading-4">
                                {benefit}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                      {/* ==================== BOTTOM ==================== */}

                      <div className="mt-5 pt-4 border-t border-primary-100 flex items-center justify-between">

                        <span className="text-[10px] font-body font-semibold text-muted uppercase tracking-wider">
                          Premium Access
                        </span>

                        <span
                          className={`
                            text-xs
                            font-display
                            font-semibold
                            flex
                            items-center
                            gap-1

                            ${
                              planType ===
                              "GOLD"
                                ? "text-secondary-500"
                                : "text-primary-600"
                            }
                          `}
                        >
                          Explore

                          <span className="text-sm">
                            →
                          </span>
                        </span>

                      </div>

                    </div>
                  </div>
                </div>

                {/* ================================================== */}
                {/* ORIGINAL PRICING CARD — UNCHANGED */}
                {/* ================================================== */}

                <div
                  className={`
                    rounded-xl2 shadow-card p-6 space-y-4
                    bg-gradient-to-br ${style.gradient}

                    ${
                      isGold
                        ? "text-white shadow-card-hover md:scale-105"
                        : ""
                    }
                  `}
                >

                  {/* ==================== PLAN HEADER ==================== */}

                  <div className="flex items-center gap-2">

                    <Icon
                      size={22}
                      className={
                        isGold
                          ? "text-white"
                          : style.accent
                      }
                    />

                    <h3 className="font-display font-bold text-xl">
                      {planType}
                    </h3>

                  </div>

                  {/* ==================== FREE PLAN ==================== */}

                  {planType === "FREE" ? (
                    <>
                      <p
                        className={`text-sm font-body ${
                          isGold
                            ? "text-white/90"
                            : "text-muted"
                        }`}
                      >
                        Basic access, always free
                      </p>

                      <ul className="space-y-2 text-sm font-body">

                        <li className="flex items-center gap-2">
                          <Check size={14} />
                          Browse & purchase products
                        </li>

                        <li className="flex items-center gap-2">
                          <Check size={14} />
                          Standard support
                        </li>

                      </ul>
                    </>
                  ) : (

                    /* ==================== PAID PLANS ==================== */

                    <div className="space-y-3">

                      {Object.entries(
                        plans[planType].price
                      ).map(
                        ([duration, price]) => (
                          <div
                            key={duration}
                            className={`
                              flex items-center justify-between
                              rounded-lg p-3

                              ${
                                isGold
                                  ? "bg-white/15"
                                  : "bg-white/70"
                              }
                            `}
                          >

                            <div>

                              <p className="font-display font-semibold text-sm">
                                {
                                  DURATION_LABELS[
                                    duration
                                  ]
                                }
                              </p>

                              <p
                                className={`
                                  text-xs font-body

                                  ${
                                    isGold
                                      ? "text-white/80"
                                      : "text-muted"
                                  }
                                `}
                              >
                                One-time access
                              </p>

                            </div>

                            <div className="flex items-center gap-3">

                              <span className="font-display font-bold">
                                ₹{price}
                              </span>

                              <Button
                                variant={
                                  isGold
                                    ? "secondary"
                                    : "primary"
                                }
                                className="!py-1.5 !px-4 text-xs"
                                disabled={
                                  purchasing ===
                                  `${planType}-${duration}`
                                }
                                onClick={() =>
                                  handlePurchase(
                                    planType,
                                    duration
                                  )
                                }
                              >
                                {purchasing ===
                                `${planType}-${duration}`
                                  ? "..."
                                  : "Buy"}
                              </Button>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* ==================== MOBILE HINT ==================== */}

      <p className="md:hidden text-center text-xs text-muted font-body mt-6">
        Explore each plan above to see its benefits.
      </p>

    </div>
  );
}