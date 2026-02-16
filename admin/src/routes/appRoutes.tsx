import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../enum/routes";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/login-page/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import PublicLayout from "../layouts/public-layout/PublicLayout";
import PrivateLayout from "../layouts/private-layout/PrivateLayout";
import InstructorDashboard from "../pages/instructor-dashboard/InstructorDashboard";
import { Admin_Roles } from "../generated/graphql";
import Courses from "../pages/courses/Courses";
import AddCourse from "../pages/add-course/AddCourse";
import Curriculum from "../pages/curriculum/Curriculum";

export const appRoutes = createBrowserRouter([
  {
    path: ROUTES.ADMIN,
    element: (
      <PrivateLayout allowedRoles={[Admin_Roles.Admin]}>
        <Dashboard />,
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.INSTRUCTOR_DASHBOARD,
    element: (
      <PrivateLayout allowedRoles={[Admin_Roles.Instructor]}>
        <InstructorDashboard />
      </PrivateLayout>
    )
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicLayout>
        <LoginPage />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.SIGNUP,
    element: (
      <PublicLayout>
        <SignupPage />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.COURSES,
    element: <PrivateLayout allowedRoles={[Admin_Roles.Instructor, Admin_Roles.Admin]}>
      <Courses />
    </PrivateLayout>
  },
  {
    path: ROUTES.ADD_COURSE,
    element: <PrivateLayout allowedRoles={[Admin_Roles.Instructor]}>
      <AddCourse />
    </PrivateLayout>
  },
  {
    path: ROUTES.COURSES + '/:id',
    element: <PrivateLayout allowedRoles={[Admin_Roles.Instructor]}>
      <AddCourse />
    </PrivateLayout>
  },
  {
    path: ROUTES.COURSE_CURRICULUM + '/:id',
    element: <PrivateLayout allowedRoles={[Admin_Roles.Instructor]}>
      <Curriculum />
    </PrivateLayout>
  },
]);
