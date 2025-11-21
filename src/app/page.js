// Default home page built by next.js

import MyNavBar from "@/components/MyNavBar";
import { MyHero } from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import GitHubCalendar from "@/components/github-calendar";

export default function Home() {
  return (
    <>
      <MyHero />
      <ProjectPreviewCard />
      <GitHubCalendar username="mayaarafa" />
      <ContactForm className="w-[40%] mb-4" />
    </>
  );
}
