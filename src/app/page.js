// Default home page built by next.js

import MyNavBar from "@/components/MyNavBar";
import { MyHero } from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MyHero />
      <ProjectPreviewCard />
    </>
  );
}
