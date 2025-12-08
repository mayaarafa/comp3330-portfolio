"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditProjectButton({ uuid, className }) {
  const router = useRouter();

  return (
    <Button
      className={className}
      onClick={() => router.push(`/projects/${uuid}/edit`)}
    >
      Edit
    </Button>
  );
}
