import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";

const EditourServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState();
  const [serviceEdit, setServiceEdit] = useState({
    heading: "",
    isActive: 1,
    description: "",
    image: "",
  });

  const initialValues = {
    image: serviceEdit?.image,
    heading: serviceEdit?.heading,
    description: serviceEdit?.description,
    isActive: serviceEdit?.isActive,
  };

  const validationSchema = Yup.object().shape({
    image: Yup.mixed().required("Image is required."),
    heading: Yup.string().required("Heading is required."),
    description: Yup.string().required("Description is required."),
    isActive: Yup.number()
      .oneOf([1, 2], "Select the status")
      .required("Status is required."),
  });

  const fields = [
    {
      label: "Image",
      name: "image",
      type: "file",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Heading",
      name: "heading",
      type: "text",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Status",
      name: "isActive",
      type: "select",
      options: [
        {
          id:1,
          name: "Active",
        },
        {
          id:2,
          name: "Inactive",
        },
      ],
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label:"Submit",
      name: "submit",
      type: "submit",
      className: "btn-theme text-sm text-white rounded px-3 py-1 my-4",
    },
  ];

  const fetchRoleData = async () => {
    try {
      const data = await AxiosHelper.getData(`get-ourService/${id}`);
      console.log("Fetched data:", data);
      if (data?.status) {
        setServiceEdit({
          image: data?.data?.image,
          heading: data?.data?.heading,
          description: data?.data?.description,
          isActive: data?.data?.isActive,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while fetching data!");
      console.log("ERROR WHILE FETCHING DATA: ", error);
    }
  };
  useEffect(() => {
    fetchRoleData();
  }, []);

  return (
    <>
 <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
              <h4 className="text-3xl font-bold text-gray-900">Our service Management</h4>
              <Link
                to="/admin/our-service"
                className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
              >
                <b>Our Services List</b>
              </Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Update Our Services</h3>
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
                  enableReinitialize={true}
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

                      const data = await AxiosHelper.putData(
                        `update-ourService/${id}`,
                        formData,
                        true
                      );

                      if (data?.status === true) {
                        toast.success(data?.data?.message);
                        navigate("/admin/our-service");
                      } else {
                        toast.error(data?.data?.message);
                        setErrors(data?.data?.data);
                      }
                    } catch (error) {
                      toast.error(
                        "Something went wrong while submitting the form."
                      );
                      console.error(error);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
    </div>

    </>
  );
};

export default EditourServices;
