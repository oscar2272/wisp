import Navigation from "../components/navigation";
import { Outlet } from "react-router";
import type { Route } from "./+types/navigation-layout";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/profiles/queries";
import { getUserProfile, getToken } from "~/features/profiles/api";
import type { UserProfile } from "~/features/profiles/type";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  console.log(userId);

  if (!userId) {
    return null;
  } else {
    const token = await getToken(request);
    console.log(token);
    if (!token) {
      return null;
    } else {
      const profile: UserProfile = await getUserProfile(token);
      return { userId, profile };
    }
  }
};
export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = !!loaderData && loaderData.userId !== null;
  const profile = loaderData?.profile;

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/70 	shadow-sm">
        <Navigation
          hasNotifications={true}
          isLoggedIn={isLoggedIn}
          username={profile?.name}
          avatar={profile?.avatar}
        />
      </nav>
      <main className="pt-20 xl:px-32 lg:px-24 md:px-16 px-8">
        <Outlet />
      </main>
    </>
  );
}
