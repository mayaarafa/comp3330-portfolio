import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { auth0 } from "@/lib/auth0";
import Profile from "./Profile";

export default async function MyNavBar() {
  const user = await auth0.getUser();
  console.log("user:", user);

  return (
    <NavigationMenu
      className={"sticky top-0 inline-flex my-2 bg-white z-1 p-1"}
      viewport={false}
    >
      <NavigationMenuList className={"w-screen justify-center"}>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/">Home</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/projects">Projects</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {user && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/projects/new">New Project</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="#">Resume</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {!user && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/contact">Contact</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {!user && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/auth/login">Log In</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {user && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Profile user={user} />
            </NavigationMenuTrigger>
            <NavigationMenuContent className={"absolute"}>
              <ul className="grid gap-2 p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="/dashboard">Dashboard</a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="/auth/logout">Log Out</a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
