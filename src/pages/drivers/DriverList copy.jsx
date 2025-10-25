import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MyForm from "../../components/Common/MyForm";
import * as Yup from "yup";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constants/fromConfig";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";
import { VerifyBadge } from "../../components/DataTable/verifyBadge";
const DriverList = () => {
  const navigate = useNavigate();
  const AlertMessage = withReactContent(Swal);
  const MySwal = withReactContent(Swal);
  const [itemsPerPage] = useState(10);
  const [errors, setErrors] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalItems, setTotalItems] = useState(0);
  const [drivers, setDrivers] = useState();
  const [show, setShow] = useState(false);
  // const [uploadDocsModal, setUploadDocsModal] = useState(false);
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // const [initialValues, setInitialValues] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   role: "",
  //   isPhoneVerified: "",
  //   Id: "",
  // });
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    image: "",
    License: [], // must be array
    LicenseNumber: "",
    Id: [], // must be array
    IdNumber: "",
    IdStatus: "",
    LicenseStatus: "",
    vehicleCategory: "",
    vehicleModel: "",
    vehicleColor: "",
    vehicleLicensePlate: "",
    vehicleYear: "",
  });

  const [initialValuesSchema, setInitialValuesSchema] = useState({
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
        url: "",
      },
      idCard: {
        idCardNumber: "",
        url: "",
        idCard_Options: "",
      },
    },
  });

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
          .test("fileSize", "One or more files are too large", (value) => {
            if (value && Array.isArray(value)) {
              return value.every((file) => file.size <= FILE_SIZE);
            }
            return true;
          })
          .test(
            "fileFormat",
            "One or more files have unsupported format",
            (value) => {
              if (value && Array.isArray(value)) {
                return value.every((file) =>
                  SUPPORTED_FORMATS_IMAGE.includes(file.type)
                );
              }
              return true;
            }
          ),
        idCard: Yup.object().shape({
          idCardNumber: Yup.string(),
          url: Yup.mixed()
            .test("fileSize", "One or more files are too large", (value) => {
              if (value && Array.isArray(value)) {
                return value.every((file) => file.size <= FILE_SIZE);
              }
              return true;
            })
            .test(
              "fileFormat",
              "One or more files have unsupported format",
              (value) => {
                if (value && Array.isArray(value)) {
                  return value.every((file) =>
                    SUPPORTED_FORMATS_IMAGE.includes(file.type)
                  );
                }
                return true;
              }
            ),
          idCard_Options: Yup.string().oneOf(
            ["Aadhaar Card", "PAN Card"],
            "Select one of the ids, Aadhaar card or PAN card."
          ),
        }),
      }),
    }),
  });

  // const fields = [
  //   {
  //     label: "Category",
  //     name: "vehicleDetails[category]",
  //     type: "select2",
  //     options: [
  //       {
  //         name: "bike",
  //         value: "bike",
  //       },
  //       {
  //         name: "taxi",
  //         value: "taxi",
  //       },

  //       {
  //         name: "car",
  //         value: "car",
  //       },
  //     ],
  //     className:
  //       "focus:shadow-soft-primary-outline capitalize text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
  //   },
  //   {
  //     label: "Model",
  //     name: "vehicleDetails[model]",
  //     type: "text",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "Color",
  //     name: "vehicleDetails[color]",
  //     type: "text",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "License Plate",
  //     name: "vehicleDetails[licensePlate]",
  //     type: "text",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "year",
  //     name: "vehicleDetails[year]",
  //     type: "date",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "License Number",
  //     name: "driverDocuments[license][licenseNumber]",
  //     type: "text",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "Upload License* (Front & back | 2 file uploads required)",
  //     name: "driverDocuments[license][url]",
  //     type: "multi-file",
  //     className:
  //       "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
  //   },
  //   {
  //     label: "Id-Card Number (Add '-' separator for spaces)",
  //     name: "driverDocuments[idCard][idCardNumber]",
  //     type: "text",
  //     className: "custom-input",
  //   },
  //   {
  //     label: "Id-Card",
  //     name: "driverDocuments[idCard][idCard_Options]",
  //     type: "select2",
  //     options: [
  //       {
  //         name: "Aadhaar Card",
  //         value: "Aadhaar Card",
  //       },
  //       {
  //         name: "PAN Card",
  //         value: "PAN Card",
  //       },
  //     ],
  //     className:
  //       "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
  //   },
  //   {
  //     label: "Upload Id-Card* (Front & back | 2 file uploads required)",
  //     name: "driverDocuments[idCard][url]",
  //     type: "multi-file",
  //     className:
  //       "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
  //   },

  //   {
  //     label: "Submit",
  //     name: "submit",
  //     type: "submit",
  //     className: "btn-theme my-4 rounded py-1 font-normal",
  //   },
  // ];

  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // =============List of all users==============
  const fetchingDrivers = async () => {
    try {
      const data = await AxiosHelper.getData("drivers", param);

      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setDrivers({ count, totalPages, record, pagination });

        setTotalItems(count);
      }
    } catch (error) {
      console.log("Error while fetching users: ", error);
    }
  };
  // ============ Edit Data ==========
  const edit = async (event) => {
    const { _id } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      navigate(`/admin/user/edit/${_id}`);
    }
  };
  // ============View Data=============
  // const viewData = async (event) => {
  //   var data = JSON.parse(
  //     event.currentTarget.attributes.getNamedItem("main-data").value
  //   );
  //   setInitialValues({
  //     name: data?.name,
  //     email: data?.email,
  //     phone: data?.phone,
  //     role: data?.role,
  //     image: data?.image,
  //     License: data?.driverDocuments?.license.url,
  //     LicenseNumber: data?.driverDocuments?.license.licenseNumber,
  //     Id: data?.driverDocuments?.idCard.url,
  //     IdNumber: data?.driverDocuments?.idCard.idCardNumber,
  //     IdStatus:
  //       data?.driverDocuments?.idCard?.verified === false
  //         ? "Unverified"
  //         : "Verified",
  //     LicenseStatus:
  //       data?.driverDocuments?.license?.verified === false
  //         ? "Unverified"
  //         : "Verified",
  //     vehicleCategory: data?.vehicleDetails?.category,
  //     vehicleModel: data?.vehicleDetails?.model,
  //     vehicleColor: data?.vehicleDetails?.color,
  //     vehicleLicensePlate: data?.vehicleDetails?.licensePlate,
  //     vehicleYear: data?.vehicleDetails?.year,
  //   });
  //   setShow(true);
  // };
  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );

    setInitialValues({
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      role: data?.role || "",
      image: data?.image || "",
      License: Array.isArray(data?.driverDocuments?.license?.url)
        ? data.driverDocuments.license.url
        : [],

      Id: Array.isArray(data?.driverDocuments?.idCard?.url)
        ? data.driverDocuments.idCard.url
        : [],
      IdStatus:
        data?.driverDocuments?.idCard?.verified === false
          ? "Unverified"
          : "Verified",
      LicenseStatus:
        data?.driverDocuments?.license?.verified === false
          ? "Unverified"
          : "Verified",
      vehicleCategory: data?.vehicleDetails?.category || "--",
      vehicleModel: data?.vehicleDetails?.model || "--",
      vehicleColor: data?.vehicleDetails?.color || "--",
      vehicleLicensePlate: data?.vehicleDetails?.licensePlate || "--",
      vehicleYear: data?.vehicleDetails?.year || "--",
    });
    console.log("Full data object:", data);
    // console.log("License URL:", data?.driverDocuments?.license?.url);
    // console.log("ID Card URL:", data?.driverDocuments?.idCard?.url);

    setShow(true);
  };

  // console.log("hello",viewData);
  // =============Delete Data===============
  const deleteUser = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`user/${_id}`);
        if (data?.status) {
          fetchingDrivers();
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    }
  };
  const togglePhoneVerification = async (userId) => {
    const result = await MySwal.fire({
      title: "Do you want to update phone verification?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      template: "#my-template",
      customClass: {
        actions: "my-actions",

        confirmButton: "order-2",
        denyButton: "order-3",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await AxiosHelper.putData(`toggle-user/${userId}`);

        if (response.status) {
          MySwal.fire(
            "Updated!",
            "Phone verification status updated.",
            "success"
          );
          fetchingDrivers();
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        console.error("Error updating verification:", error);
        MySwal.fire("Error", "Something went wrong.", "error");
      }
    } else if (result.isDenied) {
      MySwal.fire(
        "Cancelled",
        "Phone verification update was cancelled.",
        "info"
      );
    }
  };

  // ========Actions===========
  const dropList = [
    {
      name: "View",
      module_id: "User",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "User",
      action: "delete",
      onClick: deleteUser,
      className: "w-full block bg-white text-danger",
    },
  ];
  const handleSortChange = (key, order) => {
    setParam({ ...param, orderDirection: order, orderBy: key });
  };
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };
  const handleClick = async (id, status) => {
    try {
      const response = await AxiosHelper.getData(
        `updateStatus/${"users"}/${id}`
      );
      if (response?.status) {
        toast.success(`Status updated to ${status ? "Active" : "Inactive"}`);
        fetchingDrivers();
      } else {
        toast.error(`Failed to update status: ${response?.message}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  useEffect(() => {
    fetchingDrivers();
    // togglePhoneVerification();
  }, [debouncedSearch, itemsPerPage, param]);

  const columns = [
    {
      key: "image",
      label: "Profile img",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            <img src={role?.image} className="w-16 h-16" alt="" />
          </div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Customer Name",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{role?.name}</div>
        </div>
      ),
    },

    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{role?.phone}</div>
        </div>
      ),
    },

    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{role?.email}</div>
        </div>
      ),
    },

    {
      key: "isVerified",
      label: "Verified",
      sortable: true,
      render: (role) => (
        <VerifyBadge
          status={role.isPhoneVerified}
          data_id={role._id}
          onClick={togglePhoneVerification}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (role) => (
        <StatusBadge
          status={role.status}
          data_id={role._id}
          onClick={handleClick}
        />
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-3xl font-bold text-gray-900">
              Customer Drivers
            </h4>
          </div>
          <DataTable
            tabletName={"User List"}
            data={drivers?.record}
            columns={columns}
            searchable={true}
            selectable={true}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                onEdit={edit}
                onView={viewData}
                onDelete={deleteUser}
              />
            )}
            currentPage={param?.pageNo}
            itemsPerPage={param?.limit}
            totalItems={totalItems}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            // sortKey={sortKey}
            // sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
        <Modal.Header>
          <Modal.Title className="font-semibold text-xl text-gray-800">
            Driver & Vehicle Details
          </Modal.Title>
          <CloseButton
            className=" text-[orange] hover:text-[red]  font-extrabold   w-10 h-10 "
            onClick={() => setShow(false)}
          >
            &times;
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-md p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-600 mb-2">
                License
              </h5>
              {/* {initialValues?.License?.map((img, idx) => (
                
                <img
                  key={idx}
                  src={img}
                  alt="License"
                  className="w-full h-32 object-contain rounded border mb-2"
                />
              ))} */}
              {initialValues?.License?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="License"
                  className="w-full h-32 object-contain rounded border mb-2"
                />
              ))}

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  initialValues.LicenseStatus === "Verified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {initialValues.LicenseStatus}
              </span>
            </div>
            <div className="border rounded-md p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-600 mb-2">
                ID Card
              </h5>
              {initialValues?.Id?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="ID"
                  className="w-full h-32 object-contain rounded border mb-2"
                />
              ))}
              {/* {initialValues?.id?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="ID"
                  className="w-full h-32 object-contain rounded border mb-2"
                />
              ))} */}
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  initialValues.IdStatus === "Verified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {initialValues.IdStatus}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <h5 className="text-md font-bold text-primary mb-3">
              Driver Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <strong>Name:</strong> {initialValues?.name}
              </div>
              <div>
                <strong>Email:</strong> {initialValues?.email}
              </div>
              <div>
                <strong>Phone:</strong> {initialValues?.phone}
              </div>
              <div>
                <strong>Role:</strong> {initialValues?.role}
              </div>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <label className="fs-6 font-bold m-0"> Driver Image</label>
                {initialValues?.image ? (
                  <img
                    src={initialValues.image}
                    alt="Uploaded"
                    className="img-thumbnail"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span className="fs-6 text-muted">No Image</span>
                )}
              </li>
            </div>
          </div>
          <div>
            <h5 className="text-md font-bold text-primary mb-3">
              Vehicle Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <strong>Category:</strong>
                {initialValues?.vehicleCategory || "--"}
              </div>
              <div>
                <strong>Model:</strong> {initialValues?.vehicleModel || "--"}
              </div>
              <div>
                <strong>Color:</strong> {initialValues?.vehicleColor || "--"}
              </div>
              <div>
                <strong>License Number:</strong>
                {initialValues?.LicenseNumber || "--"}
              </div>
              <div>
                <strong>ID Number:</strong> {initialValues?.IdNumber || "--"}
              </div>
              <div>
                <strong>License Plate:</strong>
                {initialValues?.vehicleLicensePlate || "--"}
              </div>
              <div>
                <strong>Year:</strong> {initialValues?.vehicleYear || "--"}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DriverList;


// import React, { useEffect, useState } from "react";
// import { getDeleteConfig } from "../../helper/stringHelper";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import AxiosHelper from "../../helper/AxiosHelper";
// import Action from "../../components/Table/Action";
// import { Modal, CloseButton } from "react-bootstrap";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const AlertMessage = withReactContent(Swal);

// const DriverList = () => {
//   const [show, setShow] = useState(false);
//   const [initialValues, setInitialValues] = useState({});

//   const [drivers, setDrivers] = useState();
//   const [param, setParam] = useState({
//     limit: 10,
//     pageNo: 1,
//     query: "",
//     orderBy: "createdAt",
//     orderDirection: -1,
//   });
//   // =============List of all drivers==============
//   const fetchingDrivers = async () => {
//     try {
//       const data = await AxiosHelper.getData("drivers", param);
//       if (data?.status) {
//         // console.log("DATA: ", data);
//         let { count, totalPages, record, pagination } = data.data;
//         setDrivers({ count, totalPages, record, pagination });
//       }
//     } catch (error) {
//       console.log("Error while fetching drivers data: ", error);
//     }
//   };
//   // ========== SORTING ==========
//   // const handelSort = (event) => {
//   //   var orderBy =
//   //     event.currentTarget.attributes.getNamedItem("data-sort").value;
//   //   if (param?.orderBy !== orderBy) {
//   //     setParam({ ...param, orderBy });
//   //   } else {
//   //     setParam({ ...param, orderDirection: param?.orderDirection * -1 });
//   //   }
//   // };

//   // ==============Handle Status=============
//   const handleVerification = async ({ id, license, idStatus }) => {
//     try {
//       const payload = license !== undefined ? { license } : { idStatus };

//       const endpoint =
//         license !== undefined
//           ? `verify-driver-license/${id}`
//           : `verify-driver-id-status/${id}`;

//       const data = await AxiosHelper.putData(endpoint, payload);
//       if (data?.status) {
//         toast.success(data?.data?.message);
//         fetchingDrivers();
//       } else {
//         toast.error(data?.data?.message);
//       }
//     } catch (error) {
//       toast.error("Status update failed!");

//       console.log("Failed to update: ", error);
//     }
//   };
//   // ============View Data=============
//   const viewData = async (event) => {
//     var data = JSON.parse(
//       event.currentTarget.attributes.getNamedItem("main-data").value
//     );
//     setInitialValues({
//       name: data?.name,
//       email: data?.email,
//       phone: data?.phone,
//       role: data?.role,
//       License: data?.driverDocuments?.license.url,
//       LicenseNumber: data?.driverDocuments?.license.licenseNumber,
//       Id: data?.driverDocuments?.idCard.url,
//       IdNumber: data?.driverDocuments?.idCard.idCardNumber,
//       IdStatus:
//         data?.driverDocuments?.idCard?.verified === false
//           ? "Unverified"
//           : "Verified",
//       LicenseStatus:
//         data?.driverDocuments?.license?.verified === false
//           ? "Unverified"
//           : "Verified",
//       vehicleCategory: data?.vehicleDetails?.category,
//       vehicleModel: data?.vehicleDetails?.model,
//       vehicleColor: data?.vehicleDetails?.color,
//       vehicleLicensePlate: data?.vehicleDetails?.licensePlate,
//       vehicleYear: data?.vehicleDetails?.year,
//     });
//     setShow(true);
//   };  
//   // =============Delete Data===============
//   const deleteUser = async (event) => {
//     var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
//     console.log(isConfirmed);
//     if (isConfirmed) {
//       const { _id } = await JSON.parse(
//         event.target.attributes.getNamedItem("main-data").value
//       );
//       if (_id) {
//         const data = await AxiosHelper.deleteData(`user/${_id}`);
//         if (data?.status) {
//           fetchingDrivers();
//           toast.success(data?.message);
//         } else {
//           toast.error(data?.message);
//         }
//       }
//     }
//   };
//   // ==========Update Status | Approved | Rejected | Pending Approval============
//   const handleStatus = async (id, status) => {
//     try {
//       const data = await AxiosHelper.putData(`verify-user-status/${id}`, {
//         status,
//       });
//       if (data?.status) {
//         console.log("STATUS: ", data);
//         toast.success(data?.data?.message);
//         fetchingDrivers();
//       } else {
//         toast.error(data?.data?.message);
//       }
//     } catch (error) {
//       console.log("ERROR WHILE UPDATING STATUS: ", error);
//     }
//   };
//   // ========Actions===========
//   const dropList = [
//     { name: "View",
//       module_id: "User",
//       onClick: viewData,
//       className: "w-full block bg-white text-slate-400", },
//     { name: "Delete",
//       module_id: "User",
//       action: "delete",
//       onClick: deleteUser,
//       className: "w-full block bg-white text-danger",},
//   ];
//   //   ===== Handle Page Change =====
//   const handlePageChange = (pageNo) => {
//     setParam({ ...param, pageNo });
//   };
//   useEffect(() => {
//     fetchingDrivers();
//   }, [param]);
//   return (
//     <div className="flex flex-wrap -mx-3">
//       <div className="flex-none w-full max-w-full px-3">
//         <div className="relative flex flex-col min-w-0 mb-6 break-words  border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
//           <div className="flex   items-center justify-between bg-gray-300 p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
//             <h2 className=" py-4  text-black ">Manage Drivers </h2>
//             <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end"></div>
//           </div>
//           <div className="my-2 px-6 flex items-center justify-between">
//             <div className="w-1/2 flex items-center gap-2">
//               <h4 className="ps-1">Driver List </h4>
//             </div>
//             <div className="w-1/3 flex items-center">
//               <input
//                 placeholder="Search..."
//                 onChange={(e) =>
//                   setParam({ ...param, query: e.target.value, pageNo: 1 })
//                 }
//                 type="search"
//                 id="search"
//                 className="shadow-none form-control form-control-sm"
//               />
//             </div>
//           </div>
//           <div className="flex-auto px-0 pt-0 pb-2">
//             <div className="p-2 overflow-x-auto table-responsive">
//               <table className="items-center  w-full mb-0 align-top border-gray-200 text-slate-500">
//                 <thead className="bg-gray-800 whitespace-nowrap">
//                   <tr>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       <input type="checkbox" className="w-5 h-5" />
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       Name
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       Email
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       Phone
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       License Status
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       ID Card Status
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       Status
//                     </th>
//                     <th className="p-4 text-left text-sm font-medium text-white">
//                       Action
//                     </th>             
//                   </tr>
//                 </thead>
//                 <tbody className="whitespace-nowrap">
//                   {drivers?.record?.map((driver, index) => (
//                     <tr   key={index}
//                       className="even:bg-blue-50 hover:bg-gray-100" >
//                       {/* Checkbox */}
//                       <td className="p-4 text-sm">
//                         <input
//                           type="checkbox"
//                           className="accent-blue-600 w-4 h-4"/>
//                       </td>
//                       <td className="p-4 text-slate-900 font-medium text-sm cursor-pointer"
//                         onClick={() => viewData(driver)}>{driver?.name}
//                       </td>
//                       <td className="p-4 text-slate-600 font-medium text-sm">
//                         {driver?.email}
//                       </td>
//                       <td className="p-4 text-slate-600 font-medium text-sm">
//                         {driver?.phone}
//                       </td>
//                       {/* License Verification */}
//                       <td
//                         className="p-4 cursor-pointer text-center"
//                         onClick={() =>
//                           handleVerification({
//                             id: driver?._id,
//                             license:
//                               !driver?.driverDocuments?.license?.verified,
//                           })}>
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full text-white ${
//                             driver?.driverDocuments?.license?.verified
//                               ? "bg-green-500"
//                               : "bg-gray-400"
//                           }`}
//                         >
//                           {driver?.driverDocuments?.license?.verified
//                             ? "Verified"
//                             : "Unverified"}
//                         </span>
//                       </td>
//                       {/* ID Card Verification */}
//                       <td className="p-4 cursor-pointer text-center"
//                         onClick={() => handleVerification({
//                             id: driver?._id,
//                             idStatus:
//                             !driver?.driverDocuments?.idCard?.verified,})}>
//                         <span className={`text-xs px-2 py-1 rounded-full text-white ${
//                             driver?.driverDocuments?.idCard?.verified
//                               ? "bg-green-500"
//                               : "bg-gray-400"}`} >
//                           {driver?.driverDocuments?.idCard?.verified
//                             ? "Verified"
//                             : "Unverified"}
//                         </span>
//                       </td>
//                       {/* Status Dropdown */}
//                       <td className="p-4">
//                         <select
//                           value={driver?.status}
//                           className={`text-sm rounded px-2 py-1 text-white ${
//                             driver?.status === 0
//                               ? "bg-gray-400"
//                               : driver?.status === 1
//                               ? "bg-green-500"
//                               : "bg-red-500" }`}
//                           onChange={(e) => handleStatus(driver?._id, e.target.value)  } >
//                           <option value="0" className="text-black">
//                             Pending
//                           </option>
//                           <option value="1" className="text-black">
//                             Approved
//                           </option>
//                           <option value="2" className="text-black">
//                             Rejected
//                           </option>
//                         </select>
//                       </td>
//                      {/* Actions */}
//                       <td className="p-1 align-middle bg-transparent border-b whitespace-nowrap">
//                         <Action dropList={dropList} data={driver} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="mt-3 flex items-center justify-between py-1 px-2">
//               <div className="w-auto">
//                 <p className="mb-0 fs-6">
//                   <span  className="d-none d-sm-inline-block"
//                     data-list-info="data-list-info">
//                     {(param.pageNo - 1) * param.limit + 1} to
//                     {param.pageNo * param.limit > drivers?.count
//                       ? drivers?.count
//                       : param.pageNo * param.limit}
//                     of {drivers?.count}
//                   </span>
//                 </p>
//               </div>
//               <div className="w-auto flex items-center">
//                 <div className="d-flex justify-content-center align-items-center">
//                   <button
//                     type="button"
//                     dd="disabled"
//                     className=" btn btn-falcon-default btn-sm"
//                     onClick={() => handlePageChange(drivers?.pagination[0])}>
//                     <span className="fas fa-chevron-left" />
//                   </button>
//                   <ul className="pagination mb-0 mx-1">
//                     {drivers?.pagination?.map((row) => {
//                       return (
//                         <li key={row}>
//                           <button
//                             onClick={() => handlePageChange(row)}
//                             type="button"
//                             className={`page me-1 btn btn-sm ${
//                               row === param?.pageNo
//                                 ? "border border-blue-500 shadow-lg rounded"
//                                 : "border border-slate-700 shadow-lg rounded"
//                             }`}
//                           >
//                             {row}
//                           </button>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                   <button type="button"
//                     className="btn btn-falcon-default btn-sm"
//                     onClick={() =>
//                       handlePageChange(
//                         drivers?.pagination[drivers?.pagination.length - 1])}>
//                     <span className="fas fa-chevron-right"> </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* view data modal  | Start */}
//       <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title className="font-semibold text-xl text-gray-800">
//             Driver & Vehicle Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* License */}
//             <div className="border rounded-md p-4 shadow-sm">
//               <h5 className="text-sm font-semibold text-gray-600 mb-2">
//                 License
//               </h5>
//               {initialValues?.License?.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt="License"
//                   className="w-full h-32 object-contain rounded border mb-2"
//                 />
//               ))}
//               <span
//                 className={`text-xs px-3 py-1 rounded-full ${
//                   initialValues.LicenseStatus === "Verified"
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-400 text-white"
//                 }`}
//               >
//                 {initialValues.LicenseStatus}
//               </span>
//             </div>
//             {/* ID Card */}
//             <div className="border rounded-md p-4 shadow-sm">
//               <h5 className="text-sm font-semibold text-gray-600 mb-2">
//                 ID Card
//               </h5>
//               {initialValues?.Id?.map((img, idx) => (
//                 <img key={idx}  src={img} alt="ID"
//                   className="w-full h-32 object-contain rounded border mb-2"/>))}
//               <span
//                 className={`text-xs px-3 py-1 rounded-full ${
//                   initialValues.IdStatus === "Verified"
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-400 text-white" }`} >
//                 {initialValues.IdStatus}
//               </span>
//             </div>
//           </div>
//           {/* Driver Info */}
//           <div className="mb-6">
//             <h5 className="text-md font-bold text-primary mb-3">
//               Driver Information
//             </h5>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
//               <div> <strong>Name:</strong> {initialValues?.name} </div>
//               <div><strong>Email:</strong> {initialValues?.email} </div>
//               <div> <strong>Phone:</strong> {initialValues?.phone}</div>
//               <div> <strong>Role:</strong> {initialValues?.role}</div>
//             </div>
//           </div>
//           {/* Vehicle Info */}
//           <div>
//             <h5 className="text-md font-bold text-primary mb-3">
//               Vehicle Information
//             </h5>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
//               <div><strong>Category:</strong>{initialValues?.vehicleCategory || "--"}</div>
//               <div> <strong>Model:</strong> {initialValues?.vehicleModel || "--"}</div>
//               <div> <strong>Color:</strong> {initialValues?.vehicleColor || "--"} </div>
//               <div><strong>License Number:</strong>{initialValues?.LicenseNumber || "--"} </div>
//               <div><strong>ID Number:</strong> {initialValues?.IdNumber || "--"}</div>
//               <div><strong>License Plate:</strong>{initialValues?.vehicleLicensePlate || "--"}</div>
//               <div><strong>Year:</strong> {initialValues?.vehicleYear || "--"} </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };
// export default DriverList;
