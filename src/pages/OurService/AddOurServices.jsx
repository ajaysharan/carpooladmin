import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import AxiosHelper from "../../helper/AxiosHelper";

const AddOurServices = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();

  const initialValues = {
    heading: "",
    description: "",
    image: "",
    isActive: 1,
  };

  const validationSchema = Yup.object().shape({
    heading: Yup.string().required("Heading is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed().required("Image is required"),
    isActive: Yup.number().oneOf([1, 2], "Select a valid status").required(),
  });

  const fields = [
    {
      label: "Heading",
      name: "heading",
      type: "text",
      col:6
      
    },
    {
      label: "Status",
      name: "isActive",
      type: "select2",
      options: [
        { name: "Active", value: 1 },
        { name: "Inactive", value: 2 },
      ],
      col:6

      
    },

    {
      label: "Image",
      name: "image",
      type: "file",
    },
   
    {
      label: "Description",
      name: "description",
      type: "text",
      
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
          <h4 className="text-3xl font-bold text-gray-900">Our Service Management</h4>
          <Link
            to="/admin/our-service"
            className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
          >
            <b>Our Service List</b>
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
              const formData = new FormData();
              formData.append("heading", values.heading);
              formData.append("description", values.description);
              formData.append("isActive", values.isActive);
              if (values.image) formData.append("image", values.image);

              for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
              }

              const data = await AxiosHelper.postData("create-ourService", formData, true);

              if (data?.status) {
                toast.success(data?.data?.message || "Service created");
                navigate("/admin/our-service");
              } else {
                toast.error(data?.message || "Failed to create service");
                setErrors(data?.data);
              }
            }}
          />
          </div>
        </div>
      </div>
    </div>
</div>
    // <div className="flex flex-wrap -mx-3">
    //   <div className="w-full max-w-full px-3">
    //     <div className="bg-white shadow-soft-xl rounded-2xl p-6">
    //       <div className="mb-4 flex justify-between items-center">
    //         <h6>Add Our Services</h6>
    //         <Link to="/admin/our-service" className="btn-theme text-white px-3 py-1 rounded text-sm">
    //           Go Back
    //         </Link>
    //       </div>

          // <MyForm
          //   errors={errors}
          //   fields={fields}
          //   initialValues={initialValues}
          //   validSchema={validationSchema}
          //   onSubmit={async (values) => {
          //     const formData = new FormData();
          //     formData.append("heading", values.heading);
          //     formData.append("description", values.description);
          //     formData.append("isActive", values.isActive);
          //     if (values.image) formData.append("image", values.image);

          //     for (let pair of formData.entries()) {
          //       console.log(`${pair[0]}:`, pair[1]);
          //     }

          //     const data = await AxiosHelper.postData("create-ourService", formData, true);

          //     if (data?.status) {
          //       toast.success(data?.data?.message || "Service created");
          //       navigate("/admin/our-service");
          //     } else {
          //       toast.error(data?.message || "Failed to create service");
          //       setErrors(data?.data);
          //     }
          //   }}
          // />
    //     </div>
    //   </div>
    // </div>
  );
};

export default AddOurServices;

