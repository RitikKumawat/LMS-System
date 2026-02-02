import { PUBLIC_ROUTES } from "@/enum/routes.enum";

export const isPublicRoute = (pathname: string) =>
    PUBLIC_ROUTES.some((route) =>
        route.endsWith("/")
            ? pathname.startsWith(route)
            : pathname === route
    );