"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Fullscreen } from "lucide-react";

export default function EditProjectForm({ project, uuid }) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: project.title,
      description: project.description,
      // Add any other fields from your model
    },
  });

  const { isSaving } = form.formState;

  async function onSubmit(values) {
    try {
      const res = await fetch(`/api/projects/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      toast.success("Project updated!");
      router.push(`/projects/${uuid}`);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update project");
    }
  }

  return (
    <Form {...form} className="flex-col">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...form.register("title")}
                  className="border p-2 w-full"
                />
              </FormControl>
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
                <Textarea
                  {...form.register("description")}
                  className="border p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Button type="submit" disabled={isSaving} className={"w-3xs mt-4"}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
