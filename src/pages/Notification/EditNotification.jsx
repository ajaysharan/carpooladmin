import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import { PHONE_REG_EXP } from "../../constants/fromConfig";

const EditNotification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState();
  const [userEdit, setUserEdit] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const initialValues = {
    name: userEdit?.name,
    email: userEdit?.email,
    phone: userEdit?.phone,
    role: userEdit?.role,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
      .email("email is invalid.")
      .required("email is required"),
    phone: Yup.string()
      .required("phone is required")
      .matches(PHONE_REG_EXP, "phone number should be 10 digits."),
    role: Yup.string()
      .oneOf(["driver", "passenger"])
      .required("role selection is required."),
  });
  const fields = [
    {
      label: "Heading",
      name: "heading",
      type: "text",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Message",
      name: "message",
      type: "text",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Link",
      name: "link",
      type: "text",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Files",
      name: "files",
      type: "text",
      
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
      className:
        "btn-theme text-sm text-white rounded px-2 py-1 my-4",
    },
  ];

  const getUserData = async () => {
    try {
      const data = await AxiosHelper.getData(`user/${id}`);
      if (data?.status) {
        setUserEdit({
          name: data?.data?.data?.name,
          email: data?.data?.data?.email,
          phone: data?.data?.data?.phone,
          role: data?.data?.data?.role,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while fetching data!");
      console.log("ERROR WHILE FETCHING DATA: ", error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex flex-wrap -mx">
      <div className="flex-none w-full max-w-full px-3 ">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Edit User</h6>
          </div>
          <div className="flex-auto px-6 pt-0 pb-2 ">
            <div className="p-0 overflow-x-hidden">
              <div className="w-full min-h-[50px]  text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
                <Link
                  to={`/`}
                  className="me-2 btn btn-sm btn-falcon-default text-slate-700"
                >
                  <i className="fa fa-home me-1"></i>
                  <span className="d-none d-sm-inline-block ms-1">
                    Dashboard
                  </span>
                </Link>
                <button className="btn-theme text-sm text-white rounded px-2 py-1">
                  <Link to={`/admin/user`}>Go back</Link>
                </button>
              </div>
              {/* form */}
              <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative">
                <MyForm
                  errors={errors}
                  fields={fields}
                  initialValues={initialValues}
                  validSchema={validationSchema}
                  onSubmit={async (values) => {
                    const data = await AxiosHelper.putData(
                      `user/${id}`,
                      values,
                      true
                    );
                    if (data?.status === true) {
                      toast.success(data?.data?.message);
                      navigate("/admin/user");
                    } else {
                      toast.error(data?.data?.message);
                      setErrors(data?.data?.data);
                      console.log(data);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotification;
