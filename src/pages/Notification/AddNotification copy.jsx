
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
  const [userlist, setUser] = useState();
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
      console.log("Data",data)
      if (data?.status) {
        let { record } = data.data;
        setUser(record);    
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
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "User",
      name: "users",
      type: "select2",
      options: userlist,
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
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
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
      className:
        "btn-theme text-white rounded px-3 py-1 my-4 text-sm",
    },
  ];
    useEffect(() => {
      fetchUsers();
    }, [param]);
    
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
              <h6>Add Notification </h6>
              <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
                <Link to={`/`} className="me-2 text-slate-700">
                  <i className="fa fa-home me-1"></i>
                  <span className="d-none d-sm-inline-block ms-1 ">
                    Dashboard
                  </span>
                </Link>
                <PermissionBlock module={"User"} action={"add"}>
                <button className="text-sm btn-theme text-white rounded px-2 py-1">
                  <Link to={`/admin/notification`}>Go Back</Link>
                </button>
              </PermissionBlock>
              </div>
             
            </div>
            <div className="p-4 w-full mx-auto bg-white rounded shadow">
            <MyForm
                  errors={errors}
                  fields={fields}
                  initialValues={initialValues}
                  validSchema={validationSchema}
                  onSubmit={async (values) => {
                    const data = await AxiosHelper.postData("send-notification",values,true);
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
  );
};

export default AddNotification;


