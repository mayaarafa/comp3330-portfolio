"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographyH1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Card className="flex flex-col justify-center items-center p-6">
      <TypographyH1 className="text-lg">Page Not Found</TypographyH1>
      <TypographyP>This Project Does Not Exist</TypographyP>
      <Button variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </Card>
  );
}
