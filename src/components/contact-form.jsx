"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TypographyH1 } from "./ui/typography";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactForm({ className }) {
  const contactFormSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Names should be at least 1 character" }),
    email: z.email(),
    message: z
      .string()
      .min(1, { message: "Message should be at least 1 character" })
      .max(500, { message: "Message can be max 500 characters" }),
  });

  const contactForm = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { isSubmitting } = contactForm.formState;

  async function handleSubmit(values) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);

    const sendEmail = (async () => {
      const res = await fetch("/api/contact-me", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message ?? "Something went wrong.");
      }
      return data;
    })();
    toast.promise(sendEmail, {
      loading: "Sending your email...",
      success: ({ message }) =>
        message ?? "Email sent! Thanks for reaching out!",
      error: (error) => error.message ?? "Email failed. Please try again.",
    });

    try {
      await sendEmail;
    } catch {
      // error toast already shown
    }
  }

  return (
    <div className={cn(className)}>
      <TypographyH1 className="mb-5 text-center">Contact Form</TypographyH1>
      <Form {...contactForm}>
        <form
          onSubmit={contactForm.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <FormField
            control={contactForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={contactForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={contactForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={"w-3xs mt-4"}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
