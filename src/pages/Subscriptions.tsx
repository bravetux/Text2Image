import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showLoading, showSuccess, showError, dismissToast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionPlans from '@/components/SubscriptionPlans';

const Subscriptions = () => {
  const { session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<{ plan: string | null; status: string | null }>({ plan: null, status: null });
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
      return;
    }

    if (session) {
      const fetchSubscription = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          showError('Could not fetch your subscription details.');
          console.error('Error fetching subscription:', error);
        }

        if (data) {
          setSubscription({ plan: data.subscription_plan, status: data.subscription_status });
        }
      };

      fetchSubscription();
    }
  }, [session, sessionLoading, navigate]);

  const handleSubscribe = async (planName: string) => {
    if (!session) return;
    setIsSubscribing(true);
    const toastId = showLoading(`Subscribing to ${planName} plan...`);

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planName,
          subscription_status: 'active',
          subscribed_at: new Date().toISOString(),
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setSubscription({ plan: planName, status: 'active' });
      dismissToast(toastId);
      showSuccess(`Successfully subscribed to the ${planName} plan!`);
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to update subscription.');
      console.error('Error updating subscription:', error);
    } finally {
      setIsSubscribing(false);
    }
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
      <SubscriptionPlans 
        currentPlan={subscription.plan}
        onSubscribe={handleSubscribe}
        isSubscribing={isSubscribing}
      />
      <Button variant="outline" onClick={() => navigate('/profile')} className="mt-4">
        Back to Profile
      </Button>
    </div>
  );
};

export default Subscriptions;