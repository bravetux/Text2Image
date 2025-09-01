import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionPlans from '@/components/SubscriptionPlans';

interface SubscriptionDetails {
  plan: string | null;
  status: string | null;
  subscribed_at: string | null;
  expires_at: string | null;
}

const Subscriptions = () => {
  const { session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionDetails>({ plan: null, status: null, subscribed_at: null, expires_at: null });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
      return;
    }

    if (session) {
      const fetchSubscription = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status, subscribed_at, subscription_expires_at')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          showError('Could not fetch your subscription details.');
          console.error('Error fetching subscription:', error);
        }

        if (data) {
          setSubscription({ 
            plan: data.subscription_plan, 
            status: data.subscription_status,
            subscribed_at: data.subscribed_at,
            expires_at: data.subscription_expires_at,
          });
        }
      };

      fetchSubscription();
    }
  }, [session, sessionLoading, navigate]);

  const handleChoosePlan = (planName: string, price: number) => {
    navigate('/payment', { state: { planName, price } });
  };

  if (sessionLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {subscription.status === 'active' && subscription.plan && (
        <Card className="w-full max-w-md mb-8">
          <CardHeader>
            <CardTitle>Your Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Plan:</strong> {subscription.plan}</p>
            <p><strong>Status:</strong> <span className="text-green-500 font-semibold">{subscription.status}</span></p>
            {subscription.subscribed_at && <p><strong>Subscribed On:</strong> {new Date(subscription.subscribed_at).toLocaleDateString()}</p>}
            {subscription.expires_at && <p><strong>Expires On:</strong> {new Date(subscription.expires_at).toLocaleDateString()}</p>}
          </CardContent>
        </Card>
      )}
      <SubscriptionPlans 
        currentPlan={subscription.plan}
        onSubscribe={handleChoosePlan}
        isSubscribing={false} // This will be handled on the payment page
      />
      <Button variant="outline" onClick={() => navigate('/profile')} className="mt-4">
        Back to Profile
      </Button>
    </div>
  );
};

export default Subscriptions;