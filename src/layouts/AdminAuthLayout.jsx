import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import "../assets/css/soft-ui-dashboard-tailwind.css?v=1.0.5";
import "../assets/css/nucleo-icons.css";
import "../assets/css/nucleo-svg.css";

import "../assets/js/plugins/chartjs.min.js";
import "../assets/js/soft-ui-dashboard-tailwind.js?v=1.0.5";

const AdminAuthLayout = () => {
  var { isLoggedIn } = useSelector((store) => store.admin);
  console.log("isLoggedIn", isLoggedIn);
  // return isLoggedIn ? <Navigate to={`/admin`} /> : <Outlet />;
  return <Outlet />;
};

export default AdminAuthLayout;
