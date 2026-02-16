import { BookType, LayoutDashboard } from "lucide-react";
import { Admin_Roles } from "../generated/graphql";

export const navbarLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    allowedRole: [Admin_Roles.Admin],
    icon: LayoutDashboard,
  },
  {
    name: "Dashboard",
    href: "/instructor",
    allowedRole: [Admin_Roles.Instructor],
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    href: "/courses",
    allowedRole: [Admin_Roles.Instructor, Admin_Roles.Admin],
    icon: BookType,
  },

];
