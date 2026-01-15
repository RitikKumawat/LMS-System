import { Navigate } from "react-router";
import type React from "react";
import { ROUTES } from "../../enum/routes";
import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  AdminLogoutDocument,
  GetAdminDataDocument,
} from "../../generated/graphql";
import PageLoader from "../../ui/PageLoader/PageLoader";
import CommonLayout from "../common-layout/CommonLayout";

interface PrivateLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Add this
}

const PrivateLayout = ({ children, allowedRoles = [] }: PrivateLayoutProps) => {
  const { data, loading } = useQuery(GetAdminDataDocument);
  const [logoutAdmin] = useMutation(AdminLogoutDocument);

  const user = data?.getAdminData;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        logoutAdmin();
        return;
      }
    }
  }, [loading, user, logoutAdmin]);

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <CommonLayout>
      {children}
    </CommonLayout>
    );
};

export default PrivateLayout;
