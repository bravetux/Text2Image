import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { version } from '../../package.json';

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Get help and find contact information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Contact Us</h3>
            <p className="text-muted-foreground">
              For any issues or inquiries, please reach out to our support team.
            </p>
          </div>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href="mailto:support@bravetux.com" className="text-blue-500 hover:underline">support@bravetux.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+18001234567" className="text-blue-500 hover:underline">+1-800-123-4567</a></p>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold">App Information</h3>
            <p><strong>Current Version:</strong> {version}</p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full mt-4">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;