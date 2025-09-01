import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showLoading, showSuccess, showError, dismissToast } from '@/utils/toast';

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

    const toastId = showLoading("Initializing payment...");

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // IMPORTANT: Replace with your Razorpay Key ID
      amount: price * 100, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      name: 'Image Generator Subscription',
      description: `Payment for ${planName} Plan`,
      handler: async (response: any) => {
        dismissToast(toastId);
        const paymentToastId = showLoading("Verifying payment and updating subscription...");
        
        // In a real app, you'd verify the payment signature on your backend.
        // For this example, we'll assume payment is successful and update the DB.
        
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

          dismissToast(paymentToastId);
          showSuccess(`Successfully subscribed to the ${planName} plan!`);
          navigate('/subscriptions');
        } catch (error) {
          dismissToast(paymentToastId);
          showError('Failed to update subscription after payment.');
          console.error('Error updating subscription:', error);
        }
      },
      prefill: {
        email: session.user.email,
        contact: session.user.phone,
      },
      notes: {
        user_id: session.user.id,
      },
      theme: {
        color: '#3399cc',
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      dismissToast(toastId);
    } catch (error) {
      dismissToast(toastId);
      showError("Failed to initialize Razorpay checkout.");
      console.error("Razorpay error:", error);
    }
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