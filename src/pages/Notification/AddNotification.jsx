import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import PermissionBlock from "../../components/PermissionBlock";

const AddNotification = () => {
  const [param, setparam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });
  const [userList, setUserList] = useState();
  const navigate = useNavigate();
  const initialValues = {
    heading: "",
    message: "",
    type: "info",
    link: "",
    is_all: "true",
    users: "",
    files: [],
  };

  const [errors, setErrors] = useState({});
  const validationSchema = Yup.object().shape({
    heading: Yup.string().required("heading is required."),
  });

  const fetchUsers = async () => {
    try {
      const data = await AxiosHelper.getData("user", param);
      console.log("Data", data);
      if (data?.status) {
        let { record } = data.data;
        setUserList(record);
      }
    } catch (error) {
      console.log("Error while fetching passengers data: ", error);
    }
  };
  const fields = [
    {
      label: "Select User",
      name: "is_all",
      type: "select2",
      options: [
        {
          name: "All User",
          value: 1,
        },
        {
          name: "Selected",
          value: 2,
        },
      ],
      col: 6,
    },
    {
      label: "User",
      name: "users",
      type: "select2",
      options: userList,
      col: 6,
    },
    {
      label: "Heading",
      name: "heading",
      type: "text",
      col: 6,
    },

    {
      label: "Link",
      name: "link",
      type: "text",
      col: 6,
    },
    {
      label: "Type",
      name: "type",
      type: "select2",
      options: [
        {
          name: "Active",
          value: 1,
        },
        {
          name: "Inactive",
          value: 2,
        },
      ],
      col: 6,
    },
    {
      label: "Message",
      name: "message",
      type: "text",
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];
  useEffect(() => {
    fetchUsers();
  }, [param]);

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-3xl font-bold text-gray-900">
            Notification Management
          </h4>
          <Link
            to="/admin/notification"
            className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
          >
            <b>Notification List</b>
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Notification
              </h3>
              <div className="w-80"></div>
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
                  const data = await AxiosHelper.postData(
                    "send-notification",
                    values,
                    true
                  );
                  if (data?.status === true) {
                    toast.success("SuccessFully notification added");
                    navigate("/admin/notification");
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

export default AddNotification;


