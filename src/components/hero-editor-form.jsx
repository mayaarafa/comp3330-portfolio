"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "./ui/typography";

const heroFormSchema = z.object({
  avatar: z.string().trim().min(1, "Avatar is required"),
  full_name: z.string().trim().min(2, "Name is too short").max(200),
  short_description: z
    .string()
    .trim()
    .min(2, "Short description is too short")
    .max(120, "Short description must be 120 characters or fewer"),
  long_description: z
    .string()
    .trim()
    .min(10, "Long description is too short")
    .max(5000, "Long description is too long"),
});

const HERO_PLACEHOLDER_AVATAR = "/profile.jpg";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  full_name: "Maya Arafa",
  short_description: "I am a full-stack web developer",
  long_description: "I am a full-stack web developer. Etc. Etc.",
};

export default function HeroEditorForm() {
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(heroFormSchema),
    defaultValues: defaultHeroContent,
  });

  const avatarValue = form.watch("avatar");

  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await fetch("/api/hero");
        if (!res.ok) throw new Error("Failed to load hero content");
        const { data } = await res.json();
        form.reset({
          avatar: data?.avatar || defaultHeroContent.avatar,
          full_name: data?.full_name || defaultHeroContent.full_name,
          short_description:
            data?.short_description || defaultHeroContent.short_description,
          long_description:
            data?.long_description || defaultHeroContent.long_description,
        });
      } catch (err) {
        form.reset(defaultHeroContent);
      }
    };

    loadHero();
  }, [form]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        form.setValue("avatar", result, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("avatar", values.avatar);
      formData.append("full_name", values.full_name);
      formData.append("short_description", values.short_description);
      formData.append("long_description", values.long_description);
      if (avatarFile) formData.append("avatarFile", avatarFile);

      const response = await fetch("/api/hero", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.message || "Failed to update hero section";
        throw new Error(message);
      }

      const { data } = await response.json();
      if (data) {
        form.reset({
          avatar: data.avatar,
          full_name: data.full_name,
          short_description: data.short_description,
          long_description: data.long_description,
        });
      }

      toast.success("Hero section updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update hero section");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <TypographyH2 className="mb-4 text-2xl font-semibold">
        Hero Section
      </TypographyH2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-shrink-0 mt-4">
              <div className="h-24 w-24 overflow-hidden rounded-full border bg-zinc-100 dark:bg-zinc-900">
                {avatarValue ? (
                  <img
                    src={avatarValue}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input type="hidden" {...field} />
                    </FormControl>
                    <FormLabel>Avatar</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Short tagline shown on the home page"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="long_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long description / bio</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Tell visitors more about yourself and your work"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save hero section"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
