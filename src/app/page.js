import { MyHero } from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import ContactForm from "@/components/contact-form";
import GitHubCalendar from "@/components/github-calendar";
import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth0.getSession();
  return (
    <>
      <MyHero />
      <ProjectPreviewCard user={session ? session.user : null} />
      <GitHubCalendar username="mayaarafa" />
      <ContactForm className="w-[40%] mb-4" />
    </>
  );
}
