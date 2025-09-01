import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface BackgroundImageSelectorProps {
  onImageSelect: (url: string) => void;
  selectedValue?: string;
}

export const BackgroundImageSelector = ({ onImageSelect, selectedValue }: BackgroundImageSelectorProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: functionError } = await supabase.functions.invoke('list-http-images');
        
        if (functionError) {
          throw new Error(functionError.message);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setImages(data.images || []);
      } catch (e: any) {
        console.error("Failed to fetch HTTP images:", e);
        setError("Could not load background images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-4">
        <Skeleton className="h-24 w-24 rounded-md" />
        <Skeleton className="h-24 w-24 rounded-md" />
        <Skeleton className="h-24 w-24 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (images.length === 0) {
    return (
        <p className="text-sm text-muted-foreground">No background images found for the current month.</p>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {images.map((imageUrl) => (
          <button
            key={imageUrl}
            type="button"
            onClick={() => onImageSelect(imageUrl)}
            className={cn(
              "flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selectedValue === imageUrl && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <img
              src={imageUrl}
              alt="Background option"
              className="h-24 w-24 object-cover rounded-md"
            />
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};