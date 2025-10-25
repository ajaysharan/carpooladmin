// import useProfile from '../../Hooks/useProfile'
import { useSelector } from "react-redux";

const CheckPermission = ({ module_id, action = "view" }) => {
  const admin = useSelector((store) => store.admin);
  const permissions = useSelector((store) => store.admin.permissions);
  if (!admin.roleId) {
    return true;
  }

  if (typeof permissions === "object" && permissions !== null) {
    if (module_id === true) {
      return true;
    } else if (module_id !== "") {
      if (
        permissions[module_id] &&
        permissions[module_id][`can_${action}`] !== undefined
      ) {
        return permissions[module_id][`can_${action}`] === true ? true : false;
      }
    } else {
      return false;
    }
  }

  return false;
};

export default CheckPermission;
