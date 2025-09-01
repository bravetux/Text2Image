import { useState, useRef, useEffect } from "react";
import { ImageGeneratorForm, ImageGeneratorFormValues } from "@/components/ImageGeneratorForm";
import { GeneratedImage } from "@/components/GeneratedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, CreditCard, LogOut, User, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProfileData {
  userName: string;
  email: string;
  phone: string;
}

const Index = () => {
  const [imageData, setImageData] = useState<ImageGeneratorFormValues | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const generatedImageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
      }

      const userName = data ? `${data.first_name || ''} ${data.last_name || ''}`.trim() : '';
      
      setProfileData({
        userName: userName,
        email: session.user.email || '',
        phone: session.user.phone || '',
      });
    };

    fetchProfile();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleFormSubmit = (values: ImageGeneratorFormValues) => {
    setIsGenerating(true);
    setImageData(values);
    setImageUrl("");
    setUserPhotoUrl("");

    if (values.userPhoto && values.userPhoto.length > 0) {
      setUserPhotoUrl(URL.createObjectURL(values.userPhoto[0]));
    }

    const handleImageLoad = (url: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Important for loading images from other domains
      img.src = url;
      img.onload = () => {
        setImageUrl(url);
        setIsGenerating(false);
      };
      img.onerror = () => {
        console.error("Failed to load image from URL:", url);
        setImageUrl("https://via.placeholder.com/800x600?text=Image+Not+Found");
        setIsGenerating(false);
      };
    };

    if (values.backgroundImageUrl) {
      handleImageLoad(values.backgroundImageUrl);
    } else {
      const query = 'nature';
      const newImageUrl = `https://source.unsplash.com/800x600/?${query}&t=${new Date().getTime()}`;
      handleImageLoad(newImageUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 md:p-8 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate('/support')}>
          <LifeBuoy className="mr-2 h-4 w-4" />
          Support
        </Button>
        <Button variant="outline" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="outline" onClick={() => navigate('/subscriptions')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-16">
        <div className="w-full">
          {profileData ? (
            <ImageGeneratorForm 
              onSubmit={handleFormSubmit} 
              isGenerating={isGenerating}
              initialValues={profileData}
            />
          ) : (
            <Card className="w-full max-w-lg">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-full flex items-center justify-center md:sticky md:top-8">
          {isGenerating && (
            <div className="w-full max-w-lg space-y-2">
              <Skeleton className="h-96 w-full rounded-t-xl" />
              <Skeleton className="h-[90px] w-full rounded-b-xl" />
            </div>
          )}

          {imageUrl && imageData && !isGenerating && (
            <div ref={generatedImageRef}>
              <GeneratedImage 
                imageUrl={imageUrl}
                userName={imageData.userName}
                email={imageData.email}
                phone={imageData.phone}
                wishText={imageData.customWish}
                userPhotoUrl={userPhotoUrl}
                fontSize={imageData.fontSize}
                textAlign={imageData.textAlign}
                fontColor={imageData.fontColor}
                userPhotoAlignment={imageData.userPhotoAlignment}
                userPhotoSize={imageData.userPhotoSize}
                swapImageAndText={imageData.swapImageAndText}
                fontFamily={imageData.fontFamily}
                backgroundColor={imageData.backgroundColor}
                date={imageData.date}
              />
            </div>
          )}

          {!isGenerating && !imageUrl && (
            <div className="w-full max-w-lg h-96 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-ray-400 text-center p-4">
                Your generated image will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;