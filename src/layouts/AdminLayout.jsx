// src/layouts/AdminLayout.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Navigate, Outlet, useLocation, useNavigation } from "react-router-dom";
import menu_list from "../data/menu_list.js";
import { loggedOutAdmin, updateAdmin,updatePermission } from "../redux/admin/adminSlice.js";
import "../assets/css/soft-ui-dashboard-tailwind.css?v=1.0.5";
import "../assets/js/plugins/chartjs.min.js";
import { useCallback, useEffect, useState } from "react";
import AxiosHelper from "../helper/AxiosHelper.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader.jsx";
import {connectSocket ,disconnectSocket} from "../services/socket.js"

export default function AdminLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const admin = useSelector((state) => state.admin);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [hover, setHover] = useState(false);
  const [toggle, setToggle] = useState(
    localStorage.getItem("isToggle") === "1" ? true : false
  );

  const setToggleMiddle = (value) => {
    localStorage.setItem("isToggle", value ? 1 : 0);
    setToggle(value);
  };


  const updateDataAdmin = useCallback(async () => {
    const { data } = await AxiosHelper.getData(`profile`);
  
    if (data?.status === true) {
      dispatch(updateAdmin(data?.user));
      dispatch(updatePermission(data?.permissions));
      setIsLoggedIn(true);
      return true;
    } else {
      dispatch(loggedOutAdmin());
      setIsLoggedIn(false);
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (admin?._id) {
      setIsLoggedIn(true);
      let token  = localStorage.getItem('token')
      connectSocket(token)
    } else {
      updateDataAdmin();
    }
  }, [admin, updateDataAdmin]);

  

  if (navigation.state !== "idle" || isLoggedIn === null) return <Loader />;

  return isLoggedIn ? (
    <div className="m-0 font-sans antialiased font-normal text-base leading-default bg-gray-50 text-slate-500">
      <Sidebar
        logoUrl={"/admin"}
        menu={menu_list}
        setHover={setHover}
        toggle={toggle}
        setToggle={setToggle}
      />
      <main className={`ease-soft-in-out ${!toggle ? 'xl:ml-52' : 'xl:ml-10'} relative h-full min-h-screen rounded-xl transition-all duration-200`}>
        <Header
          page={"Dashboard"}
          toggle={toggle}
          setToggleMiddle={setToggleMiddle}
          user={admin}
        />
        <div className="w-full px-2 py-2 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  ) : (
    <Navigate to={`/login`} state={{ from: location }} replace />
  );
}
