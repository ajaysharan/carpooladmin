import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import AxiosHelper from "../../helper/AxiosHelper";
import { useDispatch } from "react-redux";
import { loggedInAdmin, updatePermission } from "../../redux/admin/adminSlice";
import slide1 from "../../assets/img/curved-images/loginBanner.webp";
import slide2 from "../../assets/img/curved-images/slide2.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const initialValues = { email: "", password: "" };

  const validSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required."),
    password: Yup.string().min(2).max(50).required("Password is required."),
  });

  const fields = [
    {
      label: "Email address",
      name: "email",
      type: "text",
      className:
        "w-full px-4 py-3 rounded-md bg-[#111827] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600",
    },
    {
      label: "Password",
      name: "password",
      type: showPassword ? "text" : "password",
      className: "w-full px-4 py-3 pr-10  rounded-md bg-[#111827] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 mt-4",
      suffix: (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3  w-10 h-10 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200 z-20"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </div>
      ),
    },
    {
      label: "Sign in",
      name: "submit",
      type: "submit",
      className:
        "rounded-lg bg-black transition duration-300 w-full py-3 mt-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-600 bg-black-300 text-white font-semibold text-lg",
    },
  ];

  return (
      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
          <div className="max-w-md w-full space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Welcome Back 👋</h2>
            <p className="text-md text-gray-600">Login to your account</p>

            <MyForm
              fields={fields}
              initialValues={initialValues}
              validSchema={validSchema}
              onSubmit={async (values) => {
                const data = await AxiosHelper.postData("login", values);
                if (data?.status === true) {
                  toast.success("Successfully logged in!");
                  dispatch(loggedInAdmin(data.data));
                  localStorage.setItem('token', data.data.token)
                  dispatch(updatePermission(data.data.permissions));
                  return navigate("/");
                } else {
                  toast.error(data?.message || "Login failed.");
                }
              }}
            />

            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="relative inline-flex items-center justify-center w-full px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-300 ease-in-out rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 group hover:from-purple-600 hover:to-blue-500"
            >
              <span className="absolute inset-0 w-full h-full transition-transform duration-500 transform scale-0 bg-white rounded-xl group-hover:scale-100"></span>
              <span className="relative z-10 group-hover:text-blue-700">Login</span>
            </button>
          </div>
        </div>

        {/* Right Side - Animated GIF with BG */}
        <div className="hidden md:flex w-1/2 items-center bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white justify-center">
          <img
            src={slide1} // Replace with your GIF path
            alt="Animated Ride"
            className="w-[50%] contain h-[70%]  object-cover"
          />
        </div>
      </div>

  );
}