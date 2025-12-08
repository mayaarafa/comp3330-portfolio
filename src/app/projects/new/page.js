"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TypographyH1 } from "@/components/ui/typography";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";

const newProjectSchema = z.object({
  title: z.string().min(2, { message: "Your title is too short" }).max(200),
  description: z
    .string()
    .min(10, { message: "Your description is too short" })
    .max(1000),
  img: z
    .string()
    .url({ message: "Please enter a valid URL for the image" })
    .or(z.literal(""))
    .optional(),
  link: z
    .string()
    .url({ message: "Please enter a valid URL for the link" })
    .or(z.literal(""))
    .optional(),
  keywords: z.array(z.string()).optional(),
});

export default function NewPage() {
  const { user, isLoading } = useUser();

  if (!isLoading && !user) {
    redirect("/auth/login");
  }

  const [draftKeyword, setDraftKeyword] = useState("");
  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      img: "",
      link: "",
      keywords: [],
    },
  });

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("img", values.img);
    formData.append("link", values.link);
    formData.append("keywords", JSON.stringify(values.keywords || []));

    // TODO: create backend POST endpoint to handle new project creation
    const response = await fetch("/api/projects/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        img: formData.get("img"),
        link: formData.get("link"),
        keywords: formData.getAll("keywords"),
      }),
    }).catch((error) => {
      console.error("Error submitting new project: ", error);
    });
    // TODO: handle the response retunred and catch the possible error

    if (!response.ok) {
      toast.error("There was an error in submitting the new project.");
      throw new Error("There was an error at the new project submission");
    } else {
      toast.success("New Project is Received");
      redirect("/");
    }

    // TODO: in future we will write the data to DB
  }

  return (
    <>
      <TypographyH1>Create New Project</TypographyH1>
      <div className="w-[50%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 m-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A title of your project" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A brief description of your project"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is a brief description of your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-image-link.com/image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the image URL of your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-project-link.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the link to your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => {
                const currentKeywords = field.value ?? [];

                const handleAddKeyword = () => {
                  const value = draftKeyword.trim();
                  if (!value || currentKeywords.includes(value)) return;

                  const updated = [...currentKeywords, value];
                  field.onChange(updated);
                  setDraftKeyword("");
                };

                const handleRemoveKeyword = (keyword) => {
                  const updated = currentKeywords.filter((k) => k !== keyword);
                  field.onChange(updated);
                };

                const handleKeyDown = (event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddKeyword();
                  }
                };
                return (
                  <FormItem className="flex">
                    <div className="flex flex-col gap-2 flex-1">
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            value={draftKeyword}
                            onChange={(e) => setDraftKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a keyword and press Enter"
                          />
                          <Button type="button" onClick={handleAddKeyword}>
                            Add
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Tag your project so it is easier to filter later.
                      </FormDescription>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-2 pt-6">
                      {currentKeywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="flex items-center gap-1 bg-stone-600 text-stone-200"
                        >
                          {keyword}
                          <button
                            type="button"
                            className="ml-1 text-xs"
                            onClick={() => handleRemoveKeyword(keyword)}
                            aria-label={`Remove ${keyword}`}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" className="mt-2">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
