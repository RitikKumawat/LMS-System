import {  type JSX } from "react";
import { Navigate } from "react-router";
import { ROUTES } from "../../enum/routes";
import PageLoader from "../../ui/PageLoader/PageLoader";
import { useQuery } from "@apollo/client/react";
import { GetAdminDataDocument } from "../../generated/graphql";
import { ROLES } from "../../enum/roles";

const PublicLayout = ({ children }: { children: JSX.Element }) => {
  const { data, loading } = useQuery(GetAdminDataDocument);
  

  if (loading) return <PageLoader />;

  if (data?.getAdminData.role === ROLES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }
  if(data?.getAdminData.role === ROLES.INSTRUCTOR){
    return <Navigate to={ROUTES.INSTRUCTOR_DASHBOARD} replace/>
  }

  return children;
};

export default PublicLayout;
