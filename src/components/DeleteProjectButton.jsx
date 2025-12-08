"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({
  id,
  className,
  onDeleteSuccess,
  redirectLink,
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      toast.error("There was an error deleting the project");
    } else {
      toast.success("Project deleted successfully.");
      if (onDeleteSuccess) onDeleteSuccess();
      if (redirectLink) router.replace(redirectLink);
      // router.refresh();
      // router.replace("/projects");
    }
  };

  return (
    <Button className={className} onClick={() => startTransition(handleDelete)}>
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
