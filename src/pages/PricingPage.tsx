import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowLeft } from "lucide-react";
import { useUserPlan } from "@/hooks/useUserPlan";
import { toast } from "sonner";

const plans = [
  {
    id: "monthly",
    name: "1 Month",
    price: "$5",
    period: "/month",
    description: "Try Pro for a month",
    badge: null,
    features: [
      "HSK 1–6 Full Access",
      "Complete Mock Tests",
      "Advanced Exercises",
      "Progress Tracking",
    ],
  },
  {
    id: "semi-annual",
    name: "6 Months",
    price: "$25",
    period: "/6 months",
    description: "Save 17% — most popular",
    badge: "Most Popular",
    features: [
      "HSK 1–6 Full Access",
      "Complete Mock Tests",
      "Advanced Exercises",
      "Progress Tracking",
      "Priority Support",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$59",
    period: "one-time",
    description: "Pay once, learn forever",
    badge: "Best Value",
    features: [
      "HSK 1–6 Full Access",
      "Complete Mock Tests",
      "Advanced Exercises",
      "Progress Tracking",
      "Priority Support",
      "Future Updates Included",
    ],
  },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { isPro } = useUserPlan();

  const handleSelect = (planId: string) => {
    toast.info("Payment integration coming soon! Contact admin to upgrade.", {
      duration: 5000,
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-8">
      {/* Back button */}
      <div className="w-full max-w-5xl mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 brutalist-border">
          <Crown size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Upgrade to Pro</h1>
        <p className="text-muted-foreground text-lg">
          Unlock HSK 3–6 lessons, full mock tests, and advanced practice tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan) => {
          const isPopular = plan.badge === "Most Popular";
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col brutalist-border transition-all hover:scale-[1.02] ${
                isPopular
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : ""
              }`}
            >
              {plan.badge && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold"
                  variant={isPopular ? "default" : "secondary"}
                >
                  {plan.badge === "Most Popular" && <Zap size={12} className="mr-1" />}
                  {plan.badge === "Best Value" && <Star size={12} className="mr-1" />}
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full h-11 font-bold brutalist-border"
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => handleSelect(plan.id)}
                  disabled={isPro}
                >
                  {isPro ? "Already Pro ✓" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
        Payment integration coming soon. For now, contact admin to upgrade your account to Pro.
      </p>
    </div>
  );
};

export default PricingPage;
