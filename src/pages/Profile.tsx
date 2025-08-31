import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { showLoading, showSuccess, showError, dismissToast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionPlans from '@/components/SubscriptionPlans';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'A valid phone number is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
      return;
    }

    if (session) {
      const fetchProfile = async () => {
        const toastId = showLoading('Fetching profile...');
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, phone')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116: row not found
            throw error;
          }

          if (data) {
            form.reset({
              ...data,
              phone: data.phone || session.user.phone || '',
            });
          } else {
            form.reset({
              first_name: '',
              last_name: '',
              phone: session.user.phone || '',
            });
          }
          dismissToast(toastId);
        } catch (error) {
          dismissToast(toastId);
          showError('Could not fetch your profile.');
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }
  }, [session, sessionLoading, navigate, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session) return;

    const toastId = showLoading('Updating profile...');
    try {
      // First, upsert the public profiles table, which is the primary data source for the app
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // If profile update is successful, then try to update the auth user.
      // This is secondary and might fail due to security policies (e.g., requiring re-authentication).
      // We'll log the error but won't block the user from seeing a success message for the main profile update.
      const { error: authError } = await supabase.auth.updateUser({
        phone: values.phone,
      });

      if (authError) {
        console.warn('Could not update auth user phone:', authError.message);
      }

      dismissToast(toastId);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to update profile.');
      console.error('Error updating profile:', error);
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
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={session.user.email || 'Not provided'} disabled />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')} className="w-full">
                  Back to Home
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <SubscriptionPlans />
    </div>
  );
};

// Add a simple Label component if it's not globally available
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

export default Profile;