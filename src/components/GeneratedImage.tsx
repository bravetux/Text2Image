import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

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
}

export const GeneratedImage = React.forwardRef<HTMLDivElement, GeneratedImageProps>(({ imageUrl, userName, email, phone, wishText, userPhotoUrl, fontSize, textAlign, fontColor, fontFamily, userPhotoAlignment, userPhotoSize, swapImageAndText, backgroundColor }, ref) => {
  const imageRef = useRef<HTMLImageElement>(null);
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
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 dark:bg-gray-800 w-full relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Generated background"
              className="w-full h-auto"
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
              {wishText && <p style={detailsStyle}>{wishText}</p>}
              <h3 className="font-bold" style={nameStyle}>{userName}</h3>
              <p style={detailsStyle}>{email}</p>
              <p style={detailsStyle}>{phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

GeneratedImage.displayName = "GeneratedImage";