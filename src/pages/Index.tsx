import { useState, useRef, useEffect } from "react";
import { ImageGeneratorForm, ImageGeneratorFormValues } from "@/components/ImageGeneratorForm";
import { GeneratedImage } from "@/components/GeneratedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";
import { showError } from "@/utils/toast";

const Index = () => {
  const [imageData, setImageData] = useState<ImageGeneratorFormValues | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const generatedImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (userPhotoUrl && userPhotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(userPhotoUrl);
      }
    };
  }, [userPhotoUrl]);

  const handleFormSubmit = (values: ImageGeneratorFormValues) => {
    if (!values.backgroundImageFile || values.backgroundImageFile.length === 0) {
      showError("Please upload a background image before generating.");
      return;
    }

    setIsGenerating(false);
    setImageData(values);

    const newImageUrl = URL.createObjectURL(values.backgroundImageFile[0]);
    setImageUrl(newImageUrl);

    let newUserPhotoUrl = "";
    if (values.userPhoto && values.userPhoto.length > 0) {
      newUserPhotoUrl = URL.createObjectURL(values.userPhoto[0]);
    }
    setUserPhotoUrl(newUserPhotoUrl);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 md:p-8 relative">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-16">
        <div className="w-full">
          <ImageGeneratorForm 
            onSubmit={handleFormSubmit} 
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="w-full flex items-center justify-center md:sticky md:top-8">
          {isGenerating ? (
            <div className="w-full max-w-lg space-y-2">
              <Skeleton className="h-96 w-full rounded-t-xl" />
              <Skeleton className="h-[90px] w-full rounded-b-xl" />
            </div>
          ) : imageData ? (
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
              />
            </div>
          ) : (
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