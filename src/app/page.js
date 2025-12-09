import { MyHero } from "@/components/MyHeroSection";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import SkillsCard from "@/components/SkillsCard";
import ContactForm from "@/components/contact-form";
import GitHubCalendar from "@/components/github-calendar";
import { TypographyH1 } from "@/components/ui/typography";
import { auth0 } from "@/lib/auth0";

const languages = [
  { name: "HTML", percentage: "100" },
  { name: "CSS", percentage: "100" },
  { name: "JavaScript", percentage: "100" },
  { name: "TypeScript", percentage: "100" },
  { name: "C++", percentage: "75" },
];

const tech = [
  { name: "React", percentage: "90" },
  { name: "React Native", percentage: "90" },
  { name: "Prisma", percentage: "100" },
  { name: "Supabase", percentage: "75" },
  { name: "Zustand", percentage: "100" },
];

const tools = [
  { name: "Agile Development", percentage: "100" },
  { name: "Git", percentage: "90" },
  { name: "Figma", percentage: "90" },
  { name: "Adobe Photoshop", percentage: "75" },
  { name: "Jira", percentage: "100" },
];

export default async function Home() {
  // const session = await auth0.getSession();

  return (
    <>
      <MyHero />
      <TypographyH1 className="mb-8 text-center">Skills</TypographyH1>
      <div className="flex gap-8 mb-8 flex-wrap justify-center">
        <SkillsCard title="Languages" skills={languages} />
        <SkillsCard title="Tech" skills={tech} />
        <SkillsCard title="Tools" skills={tools} />
      </div>
      <GitHubCalendar username="mayaarafa" />
      {/* <ProjectPreviewCard user={session ? session.user : null} /> */}
      <ContactForm className="w-[40%] mb-8" />
    </>
  );
}
