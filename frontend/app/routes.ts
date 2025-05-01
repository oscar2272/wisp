import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("common/layouts/navigation-layout.tsx", [
    route("/wisp", "common/pages/home-page.tsx"),
    ...prefix("/wisp/explore", [
      route("/", "common/pages/explore-page.tsx"),
      route("/:slug", "common/pages/explore-note-page.tsx"),
    ]),
  ]),

  layout("features/notes/layouts/sidebar-layout.tsx", [
    route("/wisp/notes", "features/notes/pages/note-home-page.tsx"),
    route("/wisp/notes/edit", "features/notes/pages/note-edit-page.tsx"),
    route("/wisp/notes/:slug", "features/notes/pages/note-page.tsx"),
  ]),

  layout("features/auth/layouts/auth-layout.tsx", [
    route("/auth/login", "features/auth/pages/login-page.tsx"),
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
        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
