import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// import withReactContent from "sweetalert2-react-content";
import MyForm from "../../components/Common/MyForm";
import * as Yup from "yup";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";
import { VerifyBadge } from "../../components/DataTable/verifyBadge";

const AlertMessage = withReactContent(Swal);
const UserList = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [errors, setErrors] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [uploadDocsModal, setUploadDocsModal] = useState(false);
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    isPhoneVerified: "",
    Id: "",
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
      col: 6,
    },
    {
      label: "Model",
      name: "vehicleDetails[model]",
      type: "text",
      col: 6,
    },
    {
      label: "Color",
      name: "vehicleDetails[color]",
      type: "text",
      col: 6,
    },
    {
      label: "License Plate",
      name: "vehicleDetails[licensePlate]",
      type: "text",
      col: 6,
    },
    {
      label: "year",
      name: "vehicleDetails[year]",
      type: "date",
      col: 6,
    },
    {
      label: "License Number",
      name: "driverDocuments[license][licenseNumber]",
      type: "text",
      col: 6,
    },
    {
      label: "Upload License* (Front & back | 2 file uploads required)",
      name: "driverDocuments[license][url]",
      type: "multi-file",
      col: 12,
    },
    {
      label: "Id-Card Number (Add '-' separator for spaces)",
      name: "driverDocuments[idCard][idCardNumber]",
      type: "text",
      col: 6,
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
      col: 6,
    },
    {
      label: "Upload Id-Card* (Front & back | 2 file uploads required)",
      name: "driverDocuments[idCard][url]",
      type: "multi-file",
      col: 6,
    },

    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];

  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // =============List of all users==============
  const fetchingUsers = async () => {
    try {
      const data = await AxiosHelper.getData("user", param);
      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setUsers({ count, totalPages, record, pagination });
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

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      role: data?.role,
      Id:
        data?.role === "passenger"
          ? "N/A"
          : data?.driverDocuments?.idCard?.idCard_Options,
    });
    setShow(true);
  };
  // =============Delete Data===============
  const deleteUser = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));

    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`user/${_id}`);
        if (data?.status) {
          fetchingUsers();
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
          fetchingUsers();
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
      name: "Edit",
      module_id: "User",
      action: "edit",
      onClick: edit,
      className: "w-full block bg-white text-slate-400",
    },

    {
      name: "Upload Documents for KYC",
      module_id: "driver_verification",
      action: "export",
      onClick: (event) => {
        var data = JSON.parse(
          event.currentTarget.attributes.getNamedItem("main-data").value
        );
        if (data?._id) {
          // setInitialValuesSchema((prev) => ({ ...prev, _id: data?._id }));
          setInitialValuesSchema(data);
        }
        setUploadDocsModal(true);
      },
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
        fetchingUsers();
      } else {
        toast.error(`Failed to update status: ${response?.message}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ======Fetching Users=========
  useEffect(() => {
    fetchingUsers();
  }, [param]);

  const columns = [
    {
      key: "image",
      label: "Profile Pic",
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            <img src={role?.image} className="h-16 w-16" />
          </div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Customer Name",
      sortable: true,
      render: (role) => (
        <div className="">
          <div className="text-sm font-medium text-gray-900">{role?.name}</div>
          <div
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
              role?.role === "driver"
                ? "bg-dark text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {role?.role}
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (role) => (
        <div className="">
          <div className="text-sm font-medium text-gray-900">{role?.phone}</div>
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
              Customer Management
            </h4>
            <Link
              to="/admin/user/create"
              className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
            >
              <b>Add New Customer</b>
            </Link>
          </div>
          <DataTable
            tabletName={"User List"}
            data={users?.record}
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
            totalItems={users?.count || 0}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortKey={param?.orderBy}
            sortOrder={param?.orderDirection}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
      // {/* view data modal  | Start */}
      <Modal
        size="md"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">View User</Modal.Title>
          <CloseButton
            onClick={() => setShow(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Name</label>
              <span className="fs-6">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Email</label>
              <span className="fs-5">{initialValues?.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m- font-bold">Role</label>
              <span className="fs-5">{initialValues?.role}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Phone</label>
              <span className="fs-5">{initialValues?.phone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Id Card</label>
              <span className="fs-6">{initialValues?.Id}</span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* view data modal | end */}  
      <Modal
  size="lg"
  show={uploadDocsModal}
  centered={true}
  onHide={() => setUploadDocsModal(false)}
  aria-labelledby="example-modal-sizes-title-lg"
>
  <Modal.Header>
    <Modal.Title id="example-modal-sizes-title-lg">
      Documents for Driver verification
    </Modal.Title>
    <CloseButton
      onClick={() => setUploadDocsModal(false)}
      className=" text-red-500 flex items-center justify-center"
    >
      <i className="fa fa-close"></i>
    </CloseButton>
  </Modal.Header>
  <Modal.Body>
    {/* 🟡 Add Toggle Buttons */}
    <div className="flex gap-4 mb-4">
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={async () => {
          try {
            const res = await AxiosHelper.putData(
              `verify-driver-license/${initialValuesSchema._id}`,
              { license: true }
            );
            if (res.status) {
              toast.success("License verified successfully");
            }
          } catch {
            toast.error("License verification failed");
          }
        }}
      >
        ✅ Verify License
      </button>

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={async () => {
          try {
            const res = await AxiosHelper.putData(
              `verify-driver-license/${initialValuesSchema._id}`,
              { license: false }
            );
            if (res.status) {
              toast.success("License unverified successfully");
            }
          } catch {
            toast.error("License unverification failed");
          }
        }}
      >
        ❌ Unverify License
      </button>

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={async () => {
          try {
            const res = await AxiosHelper.putData(
              `verify-driver-id-status/${initialValuesSchema._id}`,
              { idStatus: true }
            );
            if (res.status) {
              toast.success("ID verified successfully");
            }
          } catch {
            toast.error("ID verification failed");
          }
        }}
      >
        ✅ Verify ID
      </button>

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={async () => {
          try {
            const res = await AxiosHelper.putData(
              `verify-driver-id-status/${initialValuesSchema._id}`,
              { idStatus: false }
            );
            if (res.status) {
              toast.success("ID unverified successfully");
            }
          } catch {
            toast.error("ID unverification failed");
          }
        }}
      >
        ❌ Unverify ID
      </button>
    </div>

    {/* 📄 Form Below */}
    <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative">
      <MyForm
        errors={errors}
        fields={fields}
        initialValues={initialValuesSchema}
        validSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const formData = new FormData();
            const buildFormData = (formData, data, parentKey = "") => {
              if (
                data &&
                typeof data === "object" &&
                !(data instanceof File)
              ) {
                Object.keys(data).forEach((key) => {
                  const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                  buildFormData(formData, data[key], fullKey);
                });
              } else {
                formData.append(parentKey, data);
              }
            };
            buildFormData(formData, values);

            const data = await AxiosHelper.putData(
              `user-documents-verificationAdmin/${initialValuesSchema._id}`,
              formData,
              true
            );

            if (data?.status === true) {
              toast.success(data?.data?.message);
              setUploadDocsModal(false);
            } else {
              toast.error(data?.data?.message);
              setErrors(data?.data?.data);
            }
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </div>
  </Modal.Body>
</Modal>

      {/* <Modal
        size="lg"
        show={uploadDocsModal}
        centered={true}
        onHide={() => setUploadDocsModal(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Documents for Driver verification
          </Modal.Title>
          <CloseButton
            onClick={() => setUploadDocsModal(false)}
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

                  const buildFormData = (formData, data, parentKey = "") => {
                    if (
                      data &&
                      typeof data === "object" &&
                      !(data instanceof File)
                    ) {
                      Object.keys(data).forEach((key) => {
                        const fullKey = parentKey
                          ? `${parentKey}[${key}]`
                          : key;
                        buildFormData(formData, data[key], fullKey);
                      });
                    } else {
                      formData.append(parentKey, data);
                    }
                  };
                  buildFormData(formData, values);
                  const dataVal = Object.fromEntries(formData.entries());
                  console.log(dataVal);
                  const data = await AxiosHelper.putData(
                    `user-documents-verificationAdmin/${initialValuesSchema._id}`,
                    formData,
                    true
                  );
                  // alert("Upload KYC clicked!");
                 
                  console.log("data", formData);
                  if (data?.status === true) {
                    toast.success(data?.data?.message);
                    setUploadDocsModal(false);
                  } else {
                    toast.error(data?.data?.message);
                    setErrors(data?.data?.data);
                  }
                } catch (error) {
                  if (typeof error === Yup.ValidationError) {
                    error.inner.map((e) => {
                      console.log(e);
                    });
                  }
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal> */}
    </>
  );
};
export default UserList;




















    {/* Documents upload modal | start */}
      {/* <Modal
        size="lg"
        show={uploadDocsModal}
        centered={true}
        onHide={() => setUploadDocsModal(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Documents for Driver verification
          </Modal.Title>
          <CloseButton
            onClick={() => setUploadDocsModal(false)}
            className="text-red-500 flex items-center justify-center"
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

                  const buildFormData = (formData, data, parentKey = "") => {
                    if (
                      data &&
                      typeof data === "object" &&
                      !(data instanceof File)
                    ) {
                      Object.keys(data).forEach((key) => {
                        const fullKey = parentKey
                          ? `${parentKey}[${key}]`
                          : key;
                        buildFormData(formData, data[key], fullKey);
                      });
                    } else {
                      formData.append(parentKey, data);
                    }
                  };

                  buildFormData(formData, values);
                  const dataVal = Object.fromEntries(formData.entries());
                  console.log("Sending data:", dataVal);

                  const data = await AxiosHelper.putData(
                    `user-documents-verification/${initialValuesSchema._id}`,
                    formData,
                    true
                  );

                  if (data?.status === true) {
                    toast.success(data?.data?.message);
                    setUploadDocsModal(false);
                  } else {
                    toast.error(data?.data?.message);
                    setErrors(data?.data?.data);
                  }
                } catch (error) {
                  if (error instanceof Yup.ValidationError) {
                    error.inner.forEach((e) => {
                      console.log("Validation error:", e);
                    });
                  } else {
                    console.error("Unexpected error:", error);
                    toast.error("Something went wrong.");
                  }
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal> */}