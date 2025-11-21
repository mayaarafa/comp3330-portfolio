"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographyH1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function NotFound() {
  const { slug } = useParams();

  return (
    <Card className="flex flex-col justify-center items-center p-6">
      <TypographyH1 className="text-lg">Page Not Found</TypographyH1>
      <TypographyP>The Project {slug} Does Not Exist</TypographyP>
      <Button variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </Card>
  );
}
