import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 50,
    features: ["10 Image Generations/Day", "Basic Support"],
  },
  {
    name: "Pro",
    price: 100,
    features: ["100 Image Generations/Day", "Priority Support", "Access to Premium Templates"],
  },
  {
    name: "Premium",
    price: 200,
    features: ["Unlimited Image Generations", "24/7 Dedicated Support", "Access to All Templates", "Early Access to New Features"],
  },
];

interface SubscriptionPlansProps {
  currentPlan: string | null;
  onSubscribe: (planName: string) => Promise<void>;
  isSubscribing: boolean;
}

const SubscriptionPlans = ({ currentPlan, onSubscribe, isSubscribing }: SubscriptionPlansProps) => {
  return (
    <Card className="w-full max-w-md mt-8">
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
        <CardDescription>Choose a plan that works for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {plans.map((plan) => {
          const isCurrentPlan = plan.name === currentPlan;
          return (
            <Card key={plan.name} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold">₹{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                </div>
                <Button
                  onClick={() => onSubscribe(plan.name)}
                  disabled={isCurrentPlan || isSubscribing}
                >
                  {isSubscribing ? 'Processing...' : (isCurrentPlan ? "Current Plan" : "Subscribe")}
                </Button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlans;