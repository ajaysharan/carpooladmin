import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import { STATUS } from "../../constants/fromConfig"

const AddRole = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const initialValues = {
    name: "",
    status: 1,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    status: Yup.number()
      .oneOf([1, 2], "Select the status")
      .required("status is required."),
  });
  const fields = [
    {
      label: "Role",
      name: "name",
      type: "text",
      col: 12,
    },
    {
      label: "Status",
      name: "status",
      type: "select2",
      options: STATUS,
      col: 12,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
              <h4 className="text-3xl font-bold text-gray-900">Role Management</h4>
              <Link
                to="/admin/role"
                className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
              >
                <b>Role List</b>
              </Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Create Role</h3>
                <div className="w-80">
                  
                </div>
              </div>
            </div>
            <div className="p-6 ">
              <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative ">
                <MyForm 
                  errors={errors}
                  fields={fields}
                  initialValues={initialValues}
                  validSchema={validationSchema}
                  onSubmit={async (values) => {
                    const data = await AxiosHelper.postData("add-role",values, true);
                    if (data?.status === true) {
                      toast.success(data?.data?.message);
                      navigate("/admin/role");
                    } else {
                      toast.error(data?.data?.message);
                      setErrors(data?.data?.data);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  
  );
};

export default AddRole;
