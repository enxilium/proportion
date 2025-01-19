
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

import HomeClient from "./HomeClient";



export default async function Home() {
  // Check session at the server level
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/login");
  }

  else {
    const userID = session.user.email as string;
    return <HomeClient userID={userID} />;
  }

}

// Create a new client component for the main content
