import { useState, useRef } from "react";
import { ImageGeneratorForm, ImageGeneratorFormValues } from "@/components/ImageGeneratorForm";
import { GeneratedImage } from "@/components/GeneratedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";

const Index = () => {
  const [imageData, setImageData] = useState<ImageGeneratorFormValues | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const generatedImageRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (values: ImageGeneratorFormValues) => {
    console.log("Form values:", values);
    setIsGenerating(true);
    setImageData(values);
    setImageUrl("");
    setUserPhotoUrl("");

    if (values.userPhoto && values.userPhoto.length > 0) {
      setUserPhotoUrl(URL.createObjectURL(values.userPhoto[0]));
    }

    const handleImageLoad = (url: string) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImageUrl(url);
        setIsGenerating(false);
      };
      img.onerror = () => {
        setImageUrl("https://via.placeholder.com/800x600?text=Image+Not+Found");
        setIsGenerating(false);
      };
    };

    if (values.backgroundImage && values.backgroundImage.length > 0) {
      const newImageUrl = URL.createObjectURL(values.backgroundImage[0]);
      handleImageLoad(newImageUrl);
    } else {
      const query = 'nature';
      const newImageUrl = `https://source.unsplash.com/800x600/?${query}&t=${new Date().getTime()}`;
      handleImageLoad(newImageUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <ImageGeneratorForm onSubmit={handleFormSubmit} isGenerating={isGenerating} generatedImageRef={generatedImageRef} />
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
          )}

          {!isGenerating && !imageUrl && (
            <div className="w-full max-w-lg h-96 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center p-4">
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