import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import { PHONE_REG_EXP } from "../../constants/fromConfig";

const EditUser = () => {
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
      label: "Name",
      name: "name",
      type: "text",
      col:6,

    },
    {
      label: "Email",
      name: "email",
      type: "text",
      col:6,
    
    },
    {
      label: "Contact Number",
      name: "phone",
      type: "text",
      col:6,

    },
    {
      label: "Role",
      name: "role",
      type: "select2",
      col:6,
      options: [
        {
          name: "passenger",
          id: "passenger",
        },
        {
          name: "driver",
          id: "driver",
        },
      ],
     
    },
    {
      label: "Image",
      name: "image",
      type: "file",
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
     
    }
  ];

  const getUserData = async () => {
    try {
      const data = await AxiosHelper.getData(`user/${id}`);
      if (data?.status) {
        setUserEdit({
          name: data?.data?.data?.name,
          email: data?.data?.data?.email,
          phone: data?.data?.data?.phone,
          // image: data?.data?.data?.image,
          role: data?.data?.data?.role,
          isPhoneVerified:data?.data?.isPhoneVerified,
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

    <div className="min-h-screen bg-gray-100 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-3xl font-bold text-gray-900">
          Customer Management
        </h4>
        <Link
          to="/admin/user"
          className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
        >
          <b>Customer List</b>
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Create Customer
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
                    try {
                      const formData = new FormData();

                      Object.keys(values).forEach((key) => {
                        if (
                          values[key] === "" ||
                          values[key] === null ||
                          values[key] === undefined
                        )
                          return;
                        // Check for File object (like image)
                        if (
                          typeof values[key] === "object" &&
                          values[key] instanceof File
                        ) {
                         
                          formData.append(key, values[key]);
                        } else {
                          formData.append(key, values[key]);
                        }
                      });
                      const data = await AxiosHelper.putData(`user/${id}`, formData,true);
               
                      if (data?.status === true) {
                        toast.success(data?.data?.message);
                         navigate("/admin/user");
                      } else {
                        toast.error(data?.data?.message);
                        setErrors(data?.data?.data);
                      }
                    } catch (error) {
                      toast.error( "Something went wrong while submitting the form." );
                      console.error(error);
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

export default EditUser;
