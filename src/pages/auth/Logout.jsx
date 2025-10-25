import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loggedOutAdmin } from "../../redux/admin/adminSlice";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      var data = await AxiosHelper.getData("logout");
      if (data?.status === true) {
        dispatch(loggedOutAdmin());
        toast.success(data?.message);
        return navigate(`/login`);
      } else {
        toast.error(data?.message);
      }
    })();
  }, [dispatch, navigate]);

  return <Navigate to={`/login`} replace />;
};

export default Logout;
