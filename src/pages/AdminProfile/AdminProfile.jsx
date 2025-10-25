// import React, { useEffect, useState } from "react";
// import AxiosHelper from "../../helper/AxiosHelper";
// import MyForm from "../../components/Common/MyForm";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// export default function AdminProfile() {
//   const [admin, setAdmin] = useState(null);
//   const [initialValues, setInitialValues] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = async () => {
//     try {
//       const res = await AxiosHelper.getData("/profile-admin");
//       const user = res?.user || res?.data?.user;
//       if (!user) throw new Error("Invalid response");
//       setAdmin(user);
//       setInitialValues({
//         fullname: user.fullname || "",
//         email: user.email || "",
//         mobile: user.mobile || "",
//         role: user.role?._id || "",
//       });

//       if (user.image) {
//         setPreview(user.image);
//       }
//     } catch (err) {
//       toast.error("Failed to load profile");
//       console.error("Fetch error:", err);
//     }
//   };
//   const handleFormSubmit = async (values) => {
//     try {
//       if (!admin?._id) return toast.error("Admin ID not found");

//       const formData = new FormData();

//       Object.keys(values).forEach((key) => {
//         if (
//           values[key] === "" ||
//           values[key] === null ||
//           values[key] === undefined
//         )
//           return;
//         if (typeof values[key] === "object" && values[key] instanceof File) {
//           formData.append(key, values[key]);
//         } else {
//           formData.append(key, values[key]);
//         }
//       });
//       const res = await AxiosHelper.putData(
//         `/update-admin/${admin._id}`,
//         formData,
//         true // ✅ this sets 'Content-Type: multipart/form-data'
//       );
//       if (res?.status) {
//         toast.success("Profile updated successfully!");
//         fetchProfileData();
//         setImageFile(null);
//         setErrors({});
//       } else {
//         toast.error(res?.message || "Update failed");
//         setErrors(res?.data || {});
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//       console.error("Update error:", err);
//     }
//   };
//   const fields = [
//     { label: "Full Name", name: "fullname", type: "text", col: 6 },
//     { label: "Email", name: "email", type: "text", col: 6 },
//     { label: "Mobile", name: "mobile", type: "text", col: 6 },
//     { label: "Password", name: "password", type: "text", col: 6 },
//     {
//       label: "Role",
//       name: "role",
//       type: "select2",
//       col: 6,
//       disabled: true,
//       options: [
//         { id: "682b69425dd68d1c0b51c5a8", name: "Admin" },
//         { id: "driver", name: "Driver" },
//         { id: "passenger", name: "Passenger" },
//       ],
//     },
//     {
//       label: "Profile Image",
//       name: "image",
//       type: "file",
//       col: 6,
//     },
//     { label: "Submit", name: "submit", type: "submit" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 ">
//       <div className="max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-8 ">
//         <div className="flex items-center py-4 justify-between mb-2">
//           <h4 className="text-3xl font-bold text-gray-900">
//            Update Profile
//           </h4>
//           <Link
//               to="/admin"
//               className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
//             >
//               <b>Dashboard</b>
//             </Link>
//         </div>
//           {initialValues ? (
//             <>
//              <div className="  bg-white flex flex-col sm:flex-row items-center gap-6">
//                 <img
//                   src={ preview } alt="Profile"
//                   className="w-[400px] h-[200px] rounded-xl  border-4 border-white shadow-md object-cover"/>
//                 <div>
//                   <h2 className="text-2xl font-bold">{admin.fullname}</h2>
//                   <p className="text-sm opacity-80 mt-1">{admin.email}</p>
//                 </div>
//               </div>
//               <div className="p-6 sm:p-10 bg-white">
//                 <MyForm
//                   errors={errors}
//                   fields={fields}
//                   initialValues={initialValues}
//                   onSubmit={handleFormSubmit}
//                   enableReinitialize={true}
//                 />
//               </div>
//             </>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               Loading profile...
//             </div>
//           )}
//         </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import AxiosHelper from "../../helper/AxiosHelper";
import MyForm from "../../components/Common/MyForm";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await AxiosHelper.getData("/profile-admin");
      const user = res?.user || res?.data?.user;
      if (!user) throw new Error("Invalid response");
      setAdmin(user);
      setInitialValues({
        fullname: user.fullname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        role: user.role?._id || "",
      });

      if (user.image) {
        setPreview(user.image);
      }
    } catch (err) {
      toast.error("Failed to load profile");
      console.error("Fetch error:", err);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (!admin?._id) return toast.error("Admin ID not found");

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (!values[key]) return;
        formData.append(key, values[key]);
      });
      const res = await AxiosHelper.putData(
        `/update-admin/${admin._id}`,
        formData,
        true
      );
      if (res?.status) {
        toast.success("Profile updated successfully!");
        fetchProfileData();
        setImageFile(null);
        setErrors({});
      } else {
        toast.error(res?.message || "Update failed");
        setErrors(res?.data || {});
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Update error:", err);
    }
  };
  const fields = [
    { label: "Full Name", name: "fullname", type: "text", col: 6 },
    { label: "Email", name: "email", type: "text", col: 6 },
    { label: "Mobile", name: "mobile", type: "text", col: 6 },
    { label: "Password", name: "password", type: "text", col: 6 },
    {
      label: "Role",
      name: "role",
      type: "select2",
      col: 6,
      disabled: true,
      options: [
        { id: "682b69425dd68d1c0b51c5a8", name: "Admin" },
        { id: "driver", name: "Driver" },
        { id: "passenger", name: "Passenger" },
      ],
    },
    {
      label: "Profile Image",
      name: "image",
      type: "file",
      col: 6,
    },
    { label: "Submit", name: "submit", type: "submit" },
  ];
  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 ">
        <div className="flex mb-2   items-center justify-between">
          <h4 className="text-3xl font-bold text-gray-900">
            Update Profile Management
          </h4>
          <Link
            to="/admin"
            className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
          >
            <b>Dashboard</b>
          </Link>
        </div>
        {initialValues ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white mb-6 rounded-xl shadow p-6 items-center  transition-all duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {admin.fullname}
                </h2>
                <p className="text-gray-500">{admin.email}</p>
                <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded inline-block">
                  {admin.role?.name || "Admin"}
                </span>
              </div>
              <div
                className="w-[200px] h-[150px] bg-cover bg-center rounded-xl shadow border border-gray-200"
                style={{ backgroundImage: `url(${preview})` }}
              ></div>
              {/* <div className="flex w-[200px] h-[150px] justify-end md:justify-end">
                <img
                  src={preview}
                  alt="Admin"
                  className="w-full h-full object-cover rounded-xl shadow border border-gray-200"
                />
              </div> */}
            </div>
            {/* Form Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Update Details
              </h3>
              <MyForm
                errors={errors}
                fields={fields}
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                enableReinitialize={true}
              />
            </div>
          </>
        ) : (
          <div className="text-center mt-2 text-gray-500 py-10">
            Loading profile...
          </div>
        )}
      </div>
    </div>
  );
}
