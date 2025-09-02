import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Download, Share2 } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";

interface GeneratedImageProps {
  imageUrl: string;
  userName: string;
  email: string;
  phone: string;
  wishText?: string;
  userPhotoUrl?: string;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  fontColor: string;
  fontFamily: string;
  userPhotoAlignment: "left" | "center" | "right";
  userPhotoSize: number;
  swapImageAndText: boolean;
  backgroundColor: string;
  date?: string;
}

export const GeneratedImage = React.forwardRef<HTMLDivElement, GeneratedImageProps>(({ imageUrl, userName, email, phone, wishText, userPhotoUrl, fontSize, textAlign, fontColor, fontFamily, userPhotoAlignment, userPhotoSize, swapImageAndText, backgroundColor, date }, ref) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContentRef = useRef<HTMLDivElement>(null);
  const [renderedImageWidth, setRenderedImageWidth] = useState<number | undefined>(undefined);

  const calculateImageSize = useCallback(() => {
    const imageElement = imageRef.current;
    if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
      setRenderedImageWidth(imageElement.clientWidth);
    }
  }, []);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    setRenderedImageWidth(undefined);

    const handleLoad = () => {
      calculateImageSize();
    };

    imageElement.addEventListener("load", handleLoad);
    window.addEventListener("resize", calculateImageSize);

    if (imageElement.complete) {
      handleLoad();
    }

    return () => {
      imageElement.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", calculateImageSize);
    };
  }, [imageUrl, calculateImageSize]);

  const handleSaveImage = () => {
    if (imageContentRef.current) {
      html2canvas(imageContentRef.current, { useCORS: true }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "generated-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const handleShareImage = async () => {
    if (!imageContentRef.current) return;
    const toastId = showLoading("Preparing image for sharing...");

    try {
      const canvas = await html2canvas(imageContentRef.current, { useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          dismissToast(toastId);
          showError("Could not create image blob.");
          return;
        }

        try {
          const cache = await caches.open('generated-images-cache');
          const cacheUrl = `generated-image-${Date.now()}.png`;
          // Use blob.slice() to create a clone because the Response body is consumed
          const responseToCache = new Response(blob.slice(), {
            headers: { 'Content-Type': 'image/png' }
          });
          await cache.put(cacheUrl, responseToCache);
        } catch (cacheError) {
          console.warn("Could not cache the image, but will proceed with sharing.", cacheError);
        }

        const file = new File([blob], "generated-image.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          dismissToast(toastId);
          await navigator.share({
            files: [file],
            title: 'My Generated Image',
            text: 'Check out this image I created!',
          });
        } else {
          dismissToast(toastId);
          showError("Web Share API is not supported on your browser for sharing files.");
        }
      }, 'image/png');
    } catch (error) {
      dismissToast(toastId);
      console.error("Sharing failed:", error);
      showError("Failed to share image.");
    }
  };

  const containerStyle: React.CSSProperties = {
    textAlign,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    color: fontColor,
    fontFamily: fontFamily,
    lineHeight: 1.2,
  };

  const detailsStyle: React.CSSProperties = {
    fontSize: `${Math.round(fontSize * 0.75)}px`,
    color: fontColor,
    fontFamily: fontFamily,
    lineHeight: 1.2,
  };

  const detailsContainerStyle: React.CSSProperties = {
    width: renderedImageWidth ? `${renderedImageWidth}px` : "100%",
    marginInline: "auto",
    backgroundColor: backgroundColor,
  };

  const baseAvatarSize = 40;
  const baseIconSize = 20;

  const currentAvatarSize = (userPhotoSize / 100) * baseAvatarSize;
  const currentIconSize = (userPhotoSize / 100) * baseIconSize;

  return (
    <Card className="w-full max-w-lg overflow-hidden" ref={ref}>
      <CardContent className="p-0">
        <div ref={imageContentRef}>
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 dark:bg-gray-800 w-full relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Generated background"
                className="w-full h-auto"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-5xl font-extrabold text-gray-300 dark:text-gray-700 opacity-30 transform -rotate-45 select-none">
                  BRAVETUX
                </span>
              </div>
            </div>
            <div
              className={cn(
                "p-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 border-t w-full",
                { "sm:flex-row-reverse sm:space-x-reverse": swapImageAndText }
              )}
              style={detailsContainerStyle}
            >
              {userPhotoUrl && (
                <div className={cn("flex w-full sm:flex-1", {
                  "justify-start": userPhotoAlignment === "left",
                  "justify-center": userPhotoAlignment === "center",
                  "justify-end": userPhotoAlignment === "right",
                })}>
                  <Avatar style={{ width: currentAvatarSize, height: currentAvatarSize }}>
                    <AvatarImage src={userPhotoUrl} alt={userName} />
                    <AvatarFallback style={{ width: currentIconSize, height: currentIconSize }}>
                      <User style={{ width: currentIconSize, height: currentIconSize }} />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className="w-full sm:flex-1" style={containerStyle}>
                {wishText && <p style={nameStyle}>{wishText}</p>}
                <h3 className="font-bold" style={nameStyle}>{userName}</h3>
                <p style={detailsStyle}>{email}</p>
                <p style={detailsStyle}>{phone}</p>
                {date && <p style={detailsStyle}>{date}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleSaveImage}>
            <Download className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={handleShareImage}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

GeneratedImage.displayName = "GeneratedImage";