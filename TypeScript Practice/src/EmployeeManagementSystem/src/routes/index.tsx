import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import CreateUser from "@/features/users/CreateUser";
import ReadUsers from "@/features/users/ReadUsers";
import UpdateUser from "@/features/users/UpdateUser";
import RootLayout from "@/components/RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ReadUsers,
});

const createRoutePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: CreateUser,
});

const updateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/update/$id",
  component: UpdateUser,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createRoutePage,
  updateRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});
