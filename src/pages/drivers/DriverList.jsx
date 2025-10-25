import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import { Link, useNavigate } from "react-router-dom";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";
import withReactContent from "sweetalert2-react-content";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";
import { VerifyBadge } from "../../components/DataTable/verifyBadge";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constants/fromConfig";
import MyForm from "../../components/Common/MyForm";

const DriverList = () => {  
  const AlertMessage = withReactContent(Swal);
  const navigate = useNavigate();
  const [editShow, setEditShow] = useState(false);
    const [errors, setErrors] = useState();
  const MySwal = withReactContent(Swal);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalItems, setTotalItems] = useState(0);
  const [drivers, setDrivers] = useState();
  const [show, setShow] = useState(false);
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    image: "",
    License: [],
    LicenseNumber: "",
    Id: [],
    IdNumber: "",
    verified: "",
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

  const fields = [
    {
      label: "Category",
      name: "vehicleDetails[category]",
      type: "select2",
      options: [
        {
          name: "bike",
          value: "bike",
        },
        {
          name: "taxi",
          value: "taxi",
        },

        {
          name: "car",
          value: "car",
        },
      ],
      className:
        "focus:shadow-soft-primary-outline capitalize text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Model",
      name: "vehicleDetails[model]",
      type: "text",
      className: "custom-input",
    },
    {
      label: "Color",
      name: "vehicleDetails[color]",
      type: "text",
      className: "custom-input",
    },
    {
      label: "License Plate",
      name: "vehicleDetails[licensePlate]",
      type: "text",
      className: "custom-input",
    },
    {
      label: "year",
      name: "vehicleDetails[year]",
      type: "date",
      className: "custom-input",
    },
    {
      label: "License Number",
      name: "driverDocuments[license][licenseNumber]",
      type: "text",
      className: "custom-input",
    },
    {
      label: "Upload License* (Front & back | 2 file uploads required)",
      name: "driverDocuments[license][url]",
      type: "multi-file",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Id-Card Number (Add '-' separator for spaces)",
      name: "driverDocuments[idCard][idCardNumber]",
      type: "text",
      className: "custom-input",
    },
    {
      label: "Id-Card",
      name: "driverDocuments[idCard][idCard_Options]",
      type: "select2",
      options: [
        {
          name: "Aadhaar Card",
          value: "Aadhaar Card",
        },
        {
          name: "PAN Card",
          value: "PAN Card",
        },
      ],
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },
    {
      label: "Upload Id-Card* (Front & back | 2 file uploads required)",
      name: "driverDocuments[idCard][url]",
      type: "multi-file",
      className:
        "focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg bg-white bg-clip-padding font-normal text-gray-700 transition-all duration-700 focus:outline-none focus:transition-shadow my-2",
    },

    {
      label: "Submit",
      name: "submit",
      type: "submit",
      className: "btn-theme my-4 rounded py-1 font-normal",
    },
  ];
  const edit = async (event) => {
    const { _id } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      navigate(`/admin/drivers/editDriver/${_id}`);
    }
  }; 
  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);
  // console.log("initialValues", initialValues);

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
  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    const safeUrls = (urls) =>
      Array.isArray(urls) ? urls.map((url) => encodeURI(url)) : [];
        setInitialValues({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          role: data?.role || "",
          image: encodeURI(data?.image || ""),
          License: safeUrls(data?.driverDocuments?.license?.url),
          LicenseNumber: data?.driverDocuments?.license?.licenseNumber || "--",
          Id: safeUrls(data?.driverDocuments?.idCard?.url),
          IdNumber: data?.driverDocuments?.idCard?.idCardNumber || "--",
          verified: data?.driverDocuments?.idCard?.verified
            ? "Verified"
            : "Unverified",
          LicenseStatus: data?.driverDocuments?.license?.verified
            ? "Verified"
            : "Unverified",
          vehicleCategory: data?.vehicleDetails?.category || "--",
          vehicleModel: data?.vehicleDetails?.model || "--",
          vehicleColor: data?.vehicleDetails?.color || "--",
          vehicleLicensePlate: data?.vehicleDetails?.licensePlate || "--",
          vehicleYear: data?.vehicleDetails?.year || "--",
        });
    setShow(true);   
  };
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
          MySwal.fire({
            title: "success",
            text: "Phone verification  successfully update",
            icon: "fa-circle-check",
            customClass: {
              confirmButton: "btn btn-info  text-white",
            },
            buttonsStyling: true,  
          });
          fetchingDrivers();
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        console.error("Error updating verification:", error);
        console.log(error?.response?.data)
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
      name: "Edit",
      module_id: "City",
      action: "edit",
      onClick: edit,
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
  // const handleStatus = async (id, status) => {
  //   try {
  //     const data = await AxiosHelper.putData(`verify-user-status/${id}`, {
  //       status,
  //     });
  //     if (data?.status) {
  //       console.log("STATUS: ", data);
  //       toast.success(data?.data?.message);
  //       fetchingDrivers();
  //     } else {
  //       toast.error(data?.data?.message);
  //     }
  //   } catch (error) {
  //     console.log("ERROR WHILE UPDATING STATUS: ", error);
  //   }
  // };
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
    { key: "isVerified",
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
    {key: "status",
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
                onView={viewData}
                onDelete={deleteUser}/>
            )}
            currentPage={param?.pageNo}
            itemsPerPage={param?.limit}
            totalItems={totalItems}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            // sortKey={sortKey}
            // sortOrder={sortOrder}
            onSortChange={handleSortChange}/>
        </div>
      </div>
      <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
        <Modal.Header>
          <Modal.Title className="font-semibold text-xl text-gray-800">
            Driver & Vehicle Details
          </Modal.Title>
          <CloseButton
            className="text-[orange] hover:text-[red] font-extrabold w-10 h-10"
            onClick={() => setShow(false)}>
            &times;
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-md p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-600 mb-2">
                License Documents
              </h5>
              {initialValues?.License?.map((img, idx) => (
                <img key={idx}
                  src={img}
                  alt="License"
                  className="w-full h-32 object-contain rounded border mb-2"/>))}             
            </div>
            <div className="border rounded-md p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-600 mb-2">
                ID Card
              </h5>
              {initialValues?.Id?.map((img, idx) => (
                <img  key={idx}
                  src={img}
                  alt="ID"
                  className="w-full h-32 object-contain rounded border mb-2"/>))}         
            </div>
          </div>
          <div className="mb-6">
            <h5 className="text-md font-bold text-primary mb-3">
              Driver Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>  <strong>Name:</strong> {initialValues?.name} </div>
              <div> <strong>Email:</strong> {initialValues?.email} </div>
              <div> <strong>Phone:</strong> {initialValues?.phone}</div>
              <div><strong>Role:</strong> {initialValues?.role} </div>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <label className="fs-6 font-bold m-0">Driver Image</label>
                {initialValues?.image ? (
                  <img src={initialValues.image}
                    alt="Uploaded"
                    className="img-thumbnail"
                    style={{ width: "80px", height: "80px", objectFit: "cover",}} />
                    ) : (<span className="fs-6 text-muted">No Image</span> )}
              </li>
            </div>
          </div>
          <div>
            <h5 className="text-md font-bold text-primary mb-3">Vehicle Information</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div> <strong>Category:</strong> {initialValues?.vehicleCategory} </div>
              <div><strong>Model:</strong> {initialValues?.vehicleModel} </div>
              <div><strong>Color:</strong> {initialValues?.vehicleColor} </div>
              <div><strong>License Number:</strong> {initialValues?.LicenseNumber}</div>
              <div><strong>ID Number:</strong> {initialValues?.IdNumber} </div>
              <div><strong>License Plate:</strong>{initialValues?.vehicleLicensePlate} </div>
              <div><strong>Year:</strong> {initialValues?.vehicleYear}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={editShow}
        centered={true}
        onHide={() => setEditShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Edit City Details
          </Modal.Title>
          <CloseButton
            onClick={() => setEditShow(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative">
            <MyForm
              errors={errors}
              fields={fields}
              initialValues={initialValuesSchema}
              validSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const formData = new FormData();
                  Object.keys(values).forEach((key) => {
                    formData.append(key, values[key]);
                  });
                  const data = await AxiosHelper.putData(
                    `city/${initialValuesSchema.id}`,
                    formData,
                    true
                  );
                  if (data?.status) {
                    toast.success("Updated City data successfully!");
                    setEditShow(false);
                    fetchingDrivers();
                  }
                } catch (error) {
                  toast.error("Something went wrong");
                  setErrors(error);
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DriverList;
