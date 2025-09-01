import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showLoading, showSuccess, showError, dismissToast } from '@/utils/toast';

const Payment = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { planName, price } = location.state || {};

  useEffect(() => {
    if (!planName || !price) {
      showError("No subscription plan selected.");
      navigate('/subscriptions');
    }
  }, [planName, price, navigate]);

  const handlePayment = async () => {
    if (!session) {
      showError("You must be logged in to make a payment.");
      return;
    }

    const toastId = showLoading("Processing dummy payment...");

    // Simulate a 2-second payment processing delay
    setTimeout(async () => {
      dismissToast(toastId);
      const paymentToastId = showLoading("Verifying payment and updating subscription...");
      
      try {
        const { error } = await supabase.rpc('update_user_subscription', {
          user_id_to_update: session.user.id,
          new_plan_name: planName,
        });

        if (error) throw error;

        dismissToast(paymentToastId);
        showSuccess(`Successfully subscribed to the ${planName} plan!`);
        navigate('/subscriptions');
      } catch (error) {
        dismissToast(paymentToastId);
        showError('Failed to update subscription after dummy payment.');
        console.error('Error updating subscription:', error);
      }
    }, 2000);
  };

  if (!planName || !price) {
    return null; // Redirecting in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>You are subscribing to the <strong>{planName}</strong> plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₹{price}</span>
          </div>
          <Button onClick={handlePayment} className="w-full">
            Pay Now
          </Button>
          <Button variant="outline" onClick={() => navigate('/subscriptions')} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;