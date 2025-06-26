import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("common/layouts/navigation-layout.tsx", [
    index("common/pages/home-page.tsx"),
    ...prefix("/wisp", [
      route("/explore", "common/pages/explore-page.tsx"),
      route("/explore/:id", "common/pages/explore-note-page.tsx"),
      route("/about/creators", "common/pages/creator-page.tsx"),
    ]),
  ]),
  layout("features/notes/layouts/sidebar-layout.tsx", [
    route("/api/notes-action", "features/notes/pages/note-action.tsx"),
    route("/api/notes-trash-action", "features/notes/pages/trash-action.tsx"),
    route("/wisp/notes", "features/notes/pages/note-home-page.tsx"),
    route("/wisp/notes/trash", "features/notes/pages/note-trash-page.tsx"),
    route("/wisp/notes/:id/edit", "features/notes/pages/note-edit-page.tsx"),
    route("/wisp/notes/:id", "features/notes/pages/note-page.tsx"),
    route("/wisp/profile", "features/profiles/pages/profile-page.tsx"),
    route(
      "/wisp/profile/edit",
      "features/profiles/pages/profile-edit-page.tsx"
    ),
  ]),

  layout("features/auth/layouts/auth-layout.tsx", [
    route("/auth/login", "features/auth/pages/login-page.tsx"),
    route("/auth/signup", "features/auth/pages/email-signup-page.tsx"),
    route("/auth/verify-nickname", "features/auth/pages/verify-nickname.tsx"),
    route("/auth/logout", "features/auth/pages/logout-page.tsx"),
    ...prefix("/auth", [
      ...prefix("/social", [
        route("/:provider/start", "features/auth/pages/social-start-page.tsx"),
        route(
          "/:provider/complete",
          "features/auth/pages/social-complete-page.tsx"
        ),
      ]),
      ...prefix("/otp", [
        route("/loader", "features/auth/pages/otp-loader.tsx"),

        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
    ]),
  ]),
  route("/link/:id", "common/pages/link-page.tsx"),
  route("/expired", "common/pages/expired-page.tsx"),
] satisfies RouteConfig;
