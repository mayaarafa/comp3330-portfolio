import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { redirect } from "next/navigation";

class AppAuth0Client extends Auth0Client {
  async requireSession() {
    const session = await this.getSession();

    if (!session) {
      redirect("/auth/login");
    }

    return session;
  }

  async getUser() {
    const session = await this.getSession();
    return session?.user ?? null;
  }
}

export const auth0 = new AppAuth0Client();
