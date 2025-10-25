import { useSelector } from "react-redux";
import AccessDenied from "../pages/errors/permissionDenied";

export const routePermission = (Component, module = "", action = "view") => {
  return (props) => {
    const admin = useSelector((state) => state.admin);
    const permissions = useSelector((state) => state.admin.permissions);

    if (!admin.roleId) {
      return <AccessDenied {...props} />;
    }

    let defaultModule = ["Dashboard"]  ;

    if (defaultModule.includes(module)) {
      return <Component {...props} />;
    }
    if (
      module !== "" &&
      permissions[module] &&
      permissions[module][`can_${action}`] !== undefined
    ) {
      return permissions[module][`can_${action}`] ? (
        <Component {...props} />
      ) : (
        <AccessDenied {...props} />
      );
    }
    return <AccessDenied {...props} />;
    // return <Navigate to="/admin/permissionDenied" />;
  };
};
