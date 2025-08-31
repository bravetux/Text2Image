"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Switch } from "./ui/switch";

const formSchema = z.object({
  userName: z.string().min(2, "Your name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  wish: z.string().optional(),
  customWish: z.string().optional(),
  backgroundImage: z.custom<FileList>().optional(),
  userPhoto: z.custom<FileList>().optional(),
  date: z.string().optional(),
  fontSize: z.number().min(8).max(72).default(18),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  fontFamily: z.string().default("Arial"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Please enter a valid hex color.").default("#ffffff"),
  fontColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Please enter a valid hex color.").default("#333333"),
  userPhotoAlignment: z.enum(["left", "center", "right"]).default("left"),
  userPhotoSize: z.number().min(10).max(300).default(100),
  swapImageAndText: z.boolean().default(false),
});

export type ImageGeneratorFormValues = z.infer<typeof formSchema>;

interface ImageGeneratorFormProps {
  onSubmit: (values: ImageGeneratorFormValues) => void;
  isGenerating: boolean;
}

const LOCAL_STORAGE_KEY = "imageGeneratorFormData";

const wishMap: { [key: string]: string } = {
  "Birthday": "Wishing you a very Happy Birthday!",
  "Wedding": "Congratulations on your wedding!",
  "Diwali": "Happy Diwali! May the festival of lights bring joy and prosperity.",
  "Pongal": "Happy Pongal! Wishing you a bountiful harvest and happiness.",
  "Christmas": "Merry Christmas and a Happy New Year!",
  "New Year": "Happy New Year! Wishing you all the best for the year ahead.",
  "Navarathri Pooja": "Happy Navarathri! May the divine blessings be with you.",
  "Custom": ""
};

const defaultValues = {
  userName: "",
  email: "",
  phone: "",
  wish: "Birthday",
  customWish: wishMap["Birthday"],
  date: new Date().toLocaleDateString(),
  fontSize: 18,
  textAlign: "left",
  fontFamily: "Roboto",
  backgroundColor: "#ffffff",
  fontColor: "#333333",
  userPhotoAlignment: "left",
  userPhotoSize: 100,
  swapImageAndText: false,
};

export function ImageGeneratorForm({ onSubmit, isGenerating }: ImageGeneratorFormProps) {
  const [isTextOptionsOpen, setIsTextOptionsOpen] = useState(false);
  const [isImageOptionsOpen, setIsImageOptionsOpen] = useState(false);
  const [isLayoutOptionsOpen, setIsLayoutOptionsOpen] = useState(false);
  const [isColorOptionsOpen, setIsColorOptionsOpen] = useState(false);

  const getInitialValues = () => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedItem = item ? JSON.parse(item) : {};
      return { ...defaultValues, ...parsedItem, date: new Date().toLocaleDateString() };
    } catch (error) {
      console.warn("Error reading localStorage:", error);
      return defaultValues;
    }
  };

  const form = useForm<ImageGeneratorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const watchedValues = form.watch();

  useEffect(() => {
    try {
      const { backgroundImage, userPhoto, ...valuesToSave } = watchedValues;
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(valuesToSave));
    } catch (error) {
      console.warn("Error writing to localStorage:", error);
    }
  }, [JSON.stringify(watchedValues)]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Text to Image Generator</CardTitle>
        <CardDescription>Enter the details below to generate your image.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Your Name</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Email ID</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Phone Number</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wish"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Occasion</FormLabel>
                  <div className="col-span-2">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("customWish", wishMap[value] || "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an occasion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Wedding">Wedding</SelectItem>
                        <SelectItem value="Diwali">Diwali</SelectItem>
                        <SelectItem value="Pongal">Pongal</SelectItem>
                        <SelectItem value="Christmas">Christmas</SelectItem>
                        <SelectItem value="New Year">New Year</SelectItem>
                        <SelectItem value="Navarathri Pooja">Navarathri Pooja</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customWish"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Wish Message</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Textarea placeholder="Enter your wish message" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundImage"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Background Image</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPhoto"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Your Photo</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-x-1">
                  <FormLabel className="text-right pr-2">Date</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input placeholder="MM/DD/YYYY" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </div>

            <Collapsible open={isTextOptionsOpen} onOpenChange={setIsTextOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center px-2">
                  Text Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${isTextOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-2 border-t">
                <FormField
                  control={form.control}
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Font Size</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <Slider
                            min={8}
                            max={72}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textAlign"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Alignment</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            variant="outline"
                            value={field.value}
                            onValueChange={(value) => value && field.onChange(value)}
                            className="justify-start"
                          >
                            <ToggleGroupItem value="left">Left</ToggleGroupItem>
                            <ToggleGroupItem value="center">Center</ToggleGroupItem>
                            <ToggleGroupItem value="right">Right</ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Font Family</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Abril Fatface">Abril Fatface</SelectItem>
                              <SelectItem value="Alfa Slab One">Alfa Slab One</SelectItem>
                              <SelectItem value="Anton">Anton</SelectItem>
                              <SelectItem value="Arvo">Arvo</SelectItem>
                              <SelectItem value="Bebas Neue">Bebas Neue</SelectItem>
                              <SelectItem value="Bungee">Bungee</SelectItem>
                              <SelectItem value="Cabin Sketch">Cabin Sketch</SelectItem>
                              <SelectItem value="Caveat">Caveat</SelectItem>
                              <SelectItem value="Chewy">Chewy</SelectItem>
                              <SelectItem value="Comfortaa">Comfortaa</SelectItem>
                              <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                              <SelectItem value="Creepster">Creepster</SelectItem>
                              <SelectItem value="Crimson Text">Crimson Text</SelectItem>
                              <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                              <SelectItem value="Fjalla One">Fjalla One</SelectItem>
                              
                              <SelectItem value="Fugaz One">Fugaz One</SelectItem>
                              <SelectItem value="Great Vibes">Great Vibes</SelectItem>
                              <SelectItem value="Indie Flower">Indie Flower</SelectItem>
                              <SelectItem value="Josefin Sans">Josefin Sans</SelectItem>
                              <SelectItem value="Jost">Jost</SelectItem>
                              <SelectItem value="Kaushan Script">Kaushan Script</SelectItem>
                              <SelectItem value="Lobster">Lobster</SelectItem>
                              <SelectItem value="Lora">Lora</SelectItem>
                              <SelectItem value="Luckiest Guy">Luckiest Guy</SelectItem>
                              <SelectItem value="Merriweather">Merriweather</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Mukta">Mukta</SelectItem>
                              <SelectItem value="Nanum Pen Script">Nanum Pen Script</SelectItem>
                              <SelectItem value="Nosifer">Nosifer</SelectItem>
                              <SelectItem value="Nunito">Nunito</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Oswald">Oswald</SelectItem>
                              <SelectItem value="Pacifico">Pacifico</SelectItem>
                              <SelectItem value="Patrick Hand">Patrick Hand</SelectItem>
                              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                              <SelectItem value="Press Start 2P">Press Start 2P</SelectItem>
                              <SelectItem value="PT Sans">PT Sans</SelectItem>
                              <SelectItem value="Raleway">Raleway</SelectItem>
                              <SelectItem value="Righteous">Righteous</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Rock Salt">Rock Salt</SelectItem>
                              <SelectItem value="Rubik">Rubik</SelectItem>
                              <SelectItem value="Sacramento">Sacramento</SelectItem>
                              <SelectItem value="Shadows Into Light">Shadows Into Light</SelectItem>
                              <SelectItem value="Special Elite">Special Elite</SelectItem>
                              <SelectItem value="Tangerine">Tangerine</SelectItem>
                              <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                              <SelectItem value="Zeyada">Zeyada</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isImageOptionsOpen} onOpenChange={setIsImageOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center px-2">
                  Image Options (Your Photo)
                  <ChevronDown className={`h-4 w-4 transition-transform ${isImageOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-2 border-t">
                <FormField
                  control={form.control}
                  name="userPhotoSize"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Size (%)</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <Slider
                            min={10}
                            max={300}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userPhotoAlignment"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Alignment</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            variant="outline"
                            value={field.value}
                            onValueChange={(value) => value && field.onChange(value)}
                            className="justify-start"
                          >
                            <ToggleGroupItem value="left">Left</ToggleGroupItem>
                            <ToggleGroupItem value="center">Center</ToggleGroupItem>
                            <ToggleGroupItem value="right">Right</ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isLayoutOptionsOpen} onOpenChange={setIsLayoutOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center px-2">
                  Layout Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLayoutOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-2 border-t">
                <FormField
                  control={form.control}
                  name="swapImageAndText"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Swap Photo and Text</FormLabel>
                        <FormDescription>
                          Toggle to place your photo on the right and text on the left.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isColorOptionsOpen} onOpenChange={setIsColorOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center px-2">
                  Color Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${isColorOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-2 border-t">
                <FormField
                  control={form.control}
                  name="fontColor"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Font Color</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="color" {...field} className="p-1 h-10 w-14" />
                            <Input
                              type="text"
                              placeholder="#333333"
                              {...field}
                              className="w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-1">
                      <FormLabel className="text-right pr-2">Background Color</FormLabel>
                      <div className="col-span-2">
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="color" {...field} className="p-1 h-10 w-14" />
                            <Input
                              type="text"
                              placeholder="#ffffff"
                              {...field}
                              className="w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}