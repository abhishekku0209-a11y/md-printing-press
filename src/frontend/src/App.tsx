import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { ProtectedRoute } from "./components/layouts/ProtectedRoute";
import { PublicLayout } from "./components/layouts/PublicLayout";

import { AdminLoginPage } from "./pages/AdminLoginPage";
// --- Pages (lazy-loaded stubs, implemented next) ---
import { HomePage } from "./pages/HomePage";
import { AdminContentPage } from "./pages/admin/AdminContentPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminPortfolioPage } from "./pages/admin/AdminPortfolioPage";
import { AdminQuotesPage } from "./pages/admin/AdminQuotesPage";
import { AdminServicesPage } from "./pages/admin/AdminServicesPage";
import { AdminTestimonialsPage } from "./pages/admin/AdminTestimonialsPage";

// --- Route Definitions ---
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: () => (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminQuotesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/quotes",
  component: AdminQuotesPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/orders",
  component: AdminOrdersPage,
});

const adminPortfolioRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/portfolio",
  component: AdminPortfolioPage,
});

const adminServicesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/services",
  component: AdminServicesPage,
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/testimonials",
  component: AdminTestimonialsPage,
});

const adminContentRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/content",
  component: AdminContentPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([homeRoute]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminQuotesRoute,
    adminOrdersRoute,
    adminPortfolioRoute,
    adminServicesRoute,
    adminTestimonialsRoute,
    adminContentRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
