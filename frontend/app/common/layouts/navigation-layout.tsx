import Navigation from "../components/navigation";
import { Outlet } from "react-router";
import type { Route } from "./+types/navigation-layout";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/profiles/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  return { userId };
};
export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = loaderData.userId !== null; //임시
  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/70 	shadow-sm">
        <Navigation
          hasNotifications={true}
          isLoggedIn={isLoggedIn}
          username="oscar2272"
          avatar="https://github.com/oscar2272.png"
        />
      </nav>
      <main className="pt-20 xl:px-32 lg:px-24 md:px-16 px-8">
        <Outlet />
      </main>
    </>
  );
}
