
  // import React, { useEffect, useState } from "react";
  // import { useParams, useNavigate, Link } from "react-router-dom";
  // import * as Yup from "yup";
  // import { toast } from "react-toastify";
  // import AxiosHelper from "../../helper/AxiosHelper";
  // import MyForm from "../../components/Common/MyForm";
  // import {
  //   FILE_SIZE,
  //   SUPPORTED_FORMATS_IMAGE,
  // } from "../../constants/fromConfig";
  
  // const DriverEdit = () => {
  //   const { id } = useParams();
  //   const navigate = useNavigate();
  //   const [errors, setErrors] = useState();
  //   const [initialValues, setInitialValues] = useState({
  //     _id: "",
  //     vehicleDetails: {
  //       category: "",
  //       model: "",
  //       color: "",
  //       licensePlate: "",
  //       year: "",
  //     },
  //     driverDocuments: {
  //       license: {
  //         licenseNumber: "",
  //         url: [],
  //       },
  //       idCard: {
  //         idCardNumber: "",
  //         url: [],
  //         idCard_Options: "",
  //       },
  //     },
  //   });
  
  //   const [licenseVerified, setLicenseVerified] = useState(false);
  //   const [idVerified, setIdVerified] = useState(false);
  //   const [driverStatus, setDriverStatus] = useState("0");
  
  //   const validationSchema = Yup.object().shape({
  //     vehicleDetails: Yup.object().shape({
  //       category: Yup.string().required("Vehicle category is required."),
  //       model: Yup.string(),
  //       color: Yup.string(),
  //       licensePlate: Yup.string(),
  //       year: Yup.string(),
  //     }),
  //     driverDocuments: Yup.object().shape({
  //       license: Yup.object().shape({
  //         licenseNumber: Yup.string(),
  //         url: Yup.mixed()
  //           .test("fileSize", "License files too large", (value) =>
  //             Array.isArray(value)
  //               ? value.every((file) => file.size <= FILE_SIZE)
  //               : true
  //           )
  //           .test("fileFormat", "Invalid license format", (value) =>
  //             Array.isArray(value)
  //               ? value.every((file) =>
  //                   SUPPORTED_FORMATS_IMAGE.includes(file.type)
  //                 )
  //               : true
  //           ),
  //       }),
  //       idCard: Yup.object().shape({
  //         idCardNumber: Yup.string(),
  //         url: Yup.mixed()
  //           .test("fileSize", "ID files too large", (value) =>
  //             Array.isArray(value)
  //               ? value.every((file) => file.size <= FILE_SIZE)
  //               : true
  //           )
  //           .test("fileFormat", "Invalid ID format", (value) =>
  //             Array.isArray(value)
  //               ? value.every((file) =>
  //                   SUPPORTED_FORMATS_IMAGE.includes(file.type)
  //                 )
  //               : true
  //           ),
  //         idCard_Options: Yup.string().oneOf(
  //           ["Aadhaar Card", "PAN Card"],
  //           "Choose valid ID type"
  //         ),
  //       }),
  //     }),
  //   });
  
  //   const fields = [
  //     {
  //       label: "Vehicle Category",
  //       name: "vehicleDetails[category]",
  //       type: "select2",
  //       options: [
  //         { name: "bike", value: "bike" },
  //         { name: "taxi", value: "taxi" },
  //         { name: "car", value: "car" },
  //       ],
  //       col: 6,
  //     },
  //     { label: "Model", name: "vehicleDetails[model]", type: "text", col: 6 },
  //     { label: "Color", name: "vehicleDetails[color]", type: "text", col: 6 },
  //     {
  //       label: "License Plate",
  //       name: "vehicleDetails[licensePlate]",
  //       type: "text",
  //       col: 6,
  //     },
  //     { label: "Year", name: "vehicleDetails[year]", type: "date", col: 6 },
  //     {
  //       label: "License Number",
  //       name: "driverDocuments[license][licenseNumber]",
  //       type: "text",
  //       col: 6,
  //     },
  //     {
  //       label: "Upload License (2 files)",
  //       name: "driverDocuments[license][url]",
  //       type: "multi-file",
  //       col: 12,
  //     },
  //     {
  //       label: "ID Card Number",
  //       name: "driverDocuments[idCard][idCardNumber]",
  //       type: "text",
  //       col: 6,
  //     },
  //     {
  //       label: "ID Type",
  //       name: "driverDocuments[idCard][idCard_Options]",
  //       type: "select2",
  //       options: [
  //         { name: "Aadhaar Card", value: "Aadhaar Card" },
  //         { name: "PAN Card", value: "PAN Card" },
  //       ],
  //       col: 6,
  //     },
  //     {
  //       label: "Upload ID Card (2 files)",
  //       name: "driverDocuments[idCard][url]",
  //       type: "multi-file",
  //       col: 12,
  //     },
  //     { label: "Submit", name: "submit", type: "submit", col: 6 },
  //   ];
  
  //   const fetchDriverData = async () => {
  //     try {
  //       const res = await AxiosHelper.getData(`get-driver/${id}`);
  //       if (res?.status) {
  //         const data = res.data;
  //         setInitialValues({ ...data });
  //         setLicenseVerified(data?.driverDocuments?.license?.verified || false);
  //         setIdVerified(data?.driverDocuments?.idCard?.verified || false);
  //         setDriverStatus(data?.status?.toString() || "0");
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load driver data.");
  //     }
  //   };
  
  //   const verifyLicense = async (status) => {
  //     try {
  //       const res = await AxiosHelper.putData(`verify-driver-license/${id}`, {
  //         license: status,
  //       });
  //       if (res?.status) {
  //         toast.success(res.message);
  //         setLicenseVerified(status);
  //       }
  //     } catch {
  //       toast.error("License verification failed.");
  //     }
  //   };
  
  //   const verifyId = async (status) => {
  //     try {
  //       const res = await AxiosHelper.putData(`verify-driver-id-status/${id}`, {
  //         idStatus: status,
  //       });
  //       if (res?.status) {
  //         toast.success(res.message);
  //         setIdVerified(status);
  //       }
  //     } catch {
  //       toast.error("ID verification failed.");
  //     }
  //   };
  
  //   const updateDriverStatus = async (newStatus) => {
  //     try {
  //       const res = await AxiosHelper.putData(`verify-user-status/${id}`, {
  //         status: newStatus,
  //       });
  //       if (res?.status) {
  //         toast.success(res.message);
  //         setDriverStatus(newStatus.toString());
  //       }
  //     } catch (err) {
  //       toast.error(err?.response?.data?.message || "Status update failed.");
  //     }
  //   };
  
  //   const handleSubmit = async (values) => {
  //     try {
  //       const formData = new FormData();
  //       const buildFormData = (formData, data, parentKey = "") => {
  //         if (
  //           data &&
  //           typeof data === "object" &&
  //           !(data instanceof File) &&
  //           !(data instanceof FileList)
  //         ) {
  //           Object.keys(data).forEach((key) => {
  //             const fullKey = parentKey ? `${parentKey}[${key}]` : key;
  //             buildFormData(formData, data[key], fullKey);
  //           });
  //         } else if (Array.isArray(data)) {
  //           data.forEach((file, index) => {
  //             formData.append(`${parentKey}[${index}]`, file);
  //           });
  //         } else if (data !== undefined && data !== null) {
  //           formData.append(parentKey, data);
  //         }
  //       };
  //       buildFormData(formData, values);
  
  //       const res = await AxiosHelper.putData(
  //         `update-driver/${id}`,
  //         formData,
  //         true
  //       );
  
  //       if (res?.status) {
  //         toast.success("Driver updated successfully!");
  //         navigate("/admin/driver");
  //       } else {
  //         toast.error(res?.data?.message || "Update failed");
  //         setErrors(res?.data?.data);
  //       }
  //     } catch (error) {
  //       toast.error("Something went wrong during update.");
  //       console.error(error);
  //     }
  //   };
  
  //   useEffect(() => {
  //     fetchDriverData();
  //   }, [id]);
  
  //   return (
  //     <div className="min-h-screen bg-gray-100">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="flex items-center justify-between mb-4">
  //           <h2 className="text-3xl font-bold">Edit Driver</h2>
  //           <Link
  //             to="/admin/driver"
  //             className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow"
  //           >
  //             Driver List
  //           </Link>
  //         </div>  
  //         {/* Verification Buttons */}
  //         <div className="flex flex-wrap gap-4 mb-6">
  //           <button
  //             onClick={() => verifyLicense(!licenseVerified)}
  //             className={`px-4 py-2 rounded text-white ${
  //               licenseVerified ? "bg-red-500" : "bg-green-600"
  //             }`}
  //           >
  //             {licenseVerified ? "Unverify License" : "Verify License"}
  //           </button>
  
  //           <button
  //             onClick={() => verifyId(!idVerified)}
  //             className={`px-4 py-2 rounded text-white ${
  //               idVerified ? "bg-red-500 text-black" : "bg-green-600 text-white"
  //             }`}
  //           >
  //             {idVerified ? "Unverify ID" : "Verify ID"}
  //           </button>
  
  //           <select
  //             value={driverStatus}
  //             onChange={(e) => updateDriverStatus(e.target.value)}
  //             className="px-4 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700"
  //           >
  //             <option value="0">Pending</option>
  //             <option value="1">Approved</option>
  //             <option value="2">Blocked</option>
  //           </select>
  //         </div>
  
  //         {/* Form */}
  //         <div className="bg-white rounded shadow p-6">
  //           <MyForm
  //             errors={errors}
  //             fields={fields}
  //             initialValues={initialValues}
  //             validSchema={validationSchema}
  //             onSubmit={handleSubmit}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  
  // export default DriverEdit;
  
  import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import MyForm from "../../components/Common/MyForm";
import {
  FILE_SIZE,
  SUPPORTED_FORMATS_IMAGE,
} from "../../constants/fromConfig";

const DriverEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [initialValues, setInitialValues] = useState({
    _id: "",
    vehicleDetails: {
      category: "",
      model: "",
      color: "",
      licensePlate: "",
      year: "",
    },
    driverDocuments: {
      license: {
        licenseNumber: "",
        url: [],
      },
      idCard: {
        idCardNumber: "",
        url: [],
        idCard_Options: "",
      },
    },
  });

  const [licenseVerified, setLicenseVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [driverStatus, setDriverStatus] = useState("0");

  const validationSchema = Yup.object().shape({
    vehicleDetails: Yup.object().shape({
      category: Yup.string().required("Vehicle category is required."),
      model: Yup.string(),
      color: Yup.string(),
      licensePlate: Yup.string(),
      year: Yup.string(),
    }),
    driverDocuments: Yup.object().shape({
      license: Yup.object().shape({
        licenseNumber: Yup.string(),
        url: Yup.mixed()
          .test("fileSize", "License files too large", (value) =>
            Array.isArray(value)
              ? value.every((file) => file.size <= FILE_SIZE)
              : true
          )
          .test("fileFormat", "Invalid license format", (value) =>
            Array.isArray(value)
              ? value.every((file) =>
                  SUPPORTED_FORMATS_IMAGE.includes(file.type)
                )
              : true
          ),
      }),
      idCard: Yup.object().shape({
        idCardNumber: Yup.string(),
        idCard_Options: Yup.string().oneOf(
          ["Aadhaar Card", "PAN Card"],
          "Choose valid ID type"
        ),
        url: Yup.mixed()
          .test("fileSize", "ID files too large", (value) =>
            Array.isArray(value)
              ? value.every((file) => file.size <= FILE_SIZE)
              : true
          )
          .test("fileFormat", "Invalid ID format", (value) =>
            Array.isArray(value)
              ? value.every((file) =>
                  SUPPORTED_FORMATS_IMAGE.includes(file.type)
                )
              : true
          ),
      }),
    }),
  });

  const fields = [
    {
      label: "Vehicle Category",
      name: "vehicleDetails[category]",
      type: "select2",
      options: [
        { name: "bike", value: "bike" },
        { name: "taxi", value: "taxi" },
        { name: "car", value: "car" },
      ],
      col: 6,
    },
    { label: "Model", name: "vehicleDetails[model]", type: "text", col: 6 },
    { label: "Color", name: "vehicleDetails[color]", type: "text", col: 6 },
    {
      label: "License Plate",
      name: "vehicleDetails[licensePlate]",
      type: "text",
      col: 6,
    },
    { label: "Year", name: "vehicleDetails[year]", type: "date", col: 6 },
    {
      label: "License Number",
      name: "driverDocuments[license][licenseNumber]",
      type: "text",
      col: 6,
    },
    {
      label: "Upload License (2 files)",
      name: "driverDocuments[license][url]",
      type: "multi-file",
      col: 12,
    },
    {
      label: "ID Card Number",
      name: "driverDocuments[idCard][idCardNumber]",
      type: "text",
      col: 6,
    },
    {
      label: "ID Type",
      name: "driverDocuments[idCard][idCard_Options]",
      type: "select2",
      options: [
        { name: "Aadhaar Card", value: "Aadhaar Card" },
        { name: "PAN Card", value: "PAN Card" },
      ],
      col: 6,
    },
    {
      label: "Upload ID Card (2 files)",
      name: "driverDocuments[idCard][url]",
      type: "multi-file",
      col: 12,
    },
    { label: "Submit", name: "submit", type: "submit", col: 6 },
  ];

  const fetchDriverData = async () => {
    try {
      const res = await AxiosHelper.getData(`get-driver/${id}`);
      if (res?.status) {
        const data = res.data;
        setInitialValues(data);
        setLicenseVerified(data?.driverDocuments?.license?.verified || false);
        setIdVerified(data?.driverDocuments?.idCard?.verified || false);
        setDriverStatus(data?.status?.toString() || "0");
      }
    } catch (error) {
      toast.error("Failed to load driver data.");
    }
  };

  const verifyLicense = async (status) => {
    try {
      const res = await AxiosHelper.putData(`verify-driver-license/${id}`, {
        license: status,
      });
      if (res?.status) {
        toast.success(res.message);
        setLicenseVerified(status);
      }
    } catch {
      toast.error("License verification failed.");
    }
  };

  const verifyId = async (status) => {
    try {
      const res = await AxiosHelper.putData(`verify-driver-id/${id}`, {
        idStatus: status,
      });
      if (res?.status) {
        toast.success(res.message);
        setIdVerified(status);
      }
    } catch {
      toast.error("ID verification failed.");
    }
  };

  const updateDriverStatus = async (newStatus) => {
    try {
      const res = await AxiosHelper.putData(`verify-user-status/${id}`, {
        status: newStatus,
      });
      if (res?.status) {
        toast.success(res.message);
        setDriverStatus(newStatus.toString());
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Status update failed.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      const buildFormData = (formData, data, parentKey = "") => {
        if (
          data &&
          typeof data === "object" &&
          !(data instanceof File) &&
          !(data instanceof FileList)
        ) {
          Object.keys(data).forEach((key) => {
            const fullKey = parentKey ? `${parentKey}[${key}]` : key;
            buildFormData(formData, data[key], fullKey);
          });
        } else if (Array.isArray(data)) {
          data.forEach((file, index) => {
            formData.append(`${parentKey}[${index}]`, file);
          });
        } else if (data !== undefined && data !== null) {
          formData.append(parentKey, data);
        }
      };

      buildFormData(formData, values);

      const res = await AxiosHelper.putData(
        `user-documents-verificationAdmin/${id}`,
        formData,
        true
      );

      if (res?.status) {
        toast.success("Driver KYC updated successfully!");
        navigate("/admin/driver");
      } else {
        toast.error(res?.data?.message || "Update failed");
        setErrors(res?.data?.data);
      }
    } catch (error) {
      toast.error("Something went wrong during update.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Edit Driver</h2>
          <Link
            to="/admin/drivers"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow">
            Driver List
          </Link>
        </div>

        {/* Verification Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => verifyLicense(!licenseVerified)}
            className={`px-4 py-2 rounded text-white ${
              licenseVerified ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {licenseVerified ? "Unverify License" : "Verify License"}
          </button>

          <button
            onClick={() => verifyId(!idVerified)}
            className={`px-4 py-2 rounded text-white ${
              idVerified ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {idVerified ? "Unverify ID" : "Verify ID"}
          </button>

          <select
            value={driverStatus}
            onChange={(e) => updateDriverStatus(e.target.value)}
            className="px-4 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700"
          >
            <option value="0">Pending</option>
            <option value="1">Approved</option>
            <option value="2">Blocked</option>
          </select>
        </div>

        {/* Form */}
        <div className="bg-white rounded shadow p-6">
          <MyForm
            errors={errors}
            fields={fields}
            initialValues={initialValues}
            validSchema={validationSchema}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverEdit;
