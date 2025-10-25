import React, { useEffect, useState, useRef } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PermissionBlock from "../../components/PermissionBlock";
import "datatables.net-dt";
import $ from "jquery";

const OurServices = () => {
  const AlertMessage = withReactContent(Swal);
  const [Service, setService] = useState([]);
  const [showView, setShowView] = useState(false);
  const navigate = useNavigate();
  const tableRef = useRef(null);  
  const [initialValues, setInitialValues] = useState({
    heading: "",
    description: "",
    image: "",
    createdAt: "",
    isActive: false,
  });
  // =============List of all Service==============
  const fetchingServices = async () => {
    try {
      const data = await AxiosHelper.getData("getall-ourService");
      console.log("data", data);
      if (data?.status) {
        setService(data.data?.record);
        console.log("data123", data?.record);
      }
    } catch (error) {
      console.log("Error while fetching Service: ", error);
    }
  };

  // ==============Handle Status=============
  const handleStatus = async (id, status) => {
    try {
      const data = await AxiosHelper.putData(`updateStatusService/${id}`, {
        isActive: status,
      });
      console.log(data);
      if (data?.status) {
        toast.success("Status updated!");
        fetchingServices();
      }
    } catch (error) {
      toast.error("Status update failed!");

      console.log("Failed to update: ", error);
    }
  };
  // ============ Edit Data ==========
  const editService = async (event) => {
    const { _id } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      navigate(`/admin/our-service/edit/${_id}`);
    }
  };

  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues(data);
    setShowView(true);
  };

  // =============Delete Data===============

  const deleteService = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`delete-ourService/${_id}`);
        if (data?.status) {
          toast.success(data?.message);
          fetchingServices();
        } else {
          toast.error(data?.message);
        }
      }
    }
  };

  // ========Actions===========
  const dropList = [
    {
      name: "View",
      module_id: "Role",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Edit",
      module_id: "Role",
      action: "edit",
      onClick: editService,
      className: "w-full block bg-white text-slate-400",
    },

    {
      name: "Delete",
      module_id: "Role",
      action: "delete",
      onClick: deleteService,
      className: "w-full block bg-white text-danger",
    },
  ];
  useEffect(() => {
    fetchingServices();
  }, []);

  // ==========Data-table============

  useEffect(() => {
    if (Service?.length === 0) return;
    const dt = $(tableRef.current).DataTable({
      destroy: true,
      paging: true,
      searching: true,
      ordering: true,
    });
    return () => {
      dt.destroy(true);
    };
  }, [Service?.length]);
  //
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Manage Our-services </h6>
            <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
              <Link to={`/`} className="me-2 text-slate-700">
                <i className="fa fa-home me-1"></i>
                <span className="d-none d-sm-inline-block ms-1 ">
                  Dashboard
                </span>
              </Link>
              <PermissionBlock module={"Role"} action={"add"}>
                <button className="btn-theme text-white rounded px-2 py-1 text-sm">
                  <Link to={`/admin/our-service/create`}>Add services</Link>
                </button>
              </PermissionBlock>
            </div>
          </div>
          <div className="flex-auto px-0 pt-0 pb-2">
            <div className="p-2 overflow-x-auto table-responsive">
              <table
                className="items-center w-full mb-0 align-top border-gray-200 text-slate-500"
                ref={tableRef}
              >
                <thead className="align-bottom thead-light">
                  <tr>
                    <th className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Image
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Heading
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Description
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Status
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Service?.length > 0 ? (
                    Service.map((services, index) => (
                      <tr key={index}>
                        <td
                          className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent "
                          main-data={JSON.stringify(services)}
                        >
                          <img
                            src={services?.image}
                            alt={services?.heading}
                            className="w-16 h-16 object-cover"
                          />
                        </td>
                        <td
                          className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent "
                          main-data={JSON.stringify(services)}
                        >
                          <h6 className="mb-0 leading-normal text-sm uppercase pl-4 text-primary">
                            {services?.heading}
                          </h6>
                        </td>
                        <td
                          className="p-2 align-middle bg-transparent border-b  shadow-transparent "
                          main-data={JSON.stringify(services)}
                        >
                          <p className="mb-0 leading-normal text-sm uppercase pl-4 text-primary">
                            {services?.description}
                          </p>
                        </td>
                        <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                          <span
                            className={`text-xs rounded-full px-2 py-1 font-semibold cursor-pointer ${
                              services?.isActive === 1
                                ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline leading-none text-white"
                                : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline leading-none text-white"
                            }`}  
                            onClick={() => {
                              let status = services?.isActive === 1 ? 2 : 1;
                              handleStatus(services._id, status);
                            }}
                          >
                            {services?.isActive === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                          {/* <Action dropList={dropList} data={services} /> */}
                          <Action dropList={dropList} data={services} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer text-gray-500"
                      >
                        No Record Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="md"
        show={showView}
        centered={true}
        onHide={() => setShowView(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View OurServices Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShowView(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Heading</label>
              <span className="fs-6">{initialValues?.heading}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Description</label>
              <span className="fs-6">{initialValues?.description}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Image</label>
              <span className="fs-6">{initialValues?.image}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Service Status</label>
              <span
                className={`rounded-full text-sm px-2 py-1 ${
                  initialValues?.status === 1
                    ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                    : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                }`}
              >
                {initialValues?.status === 1 ? "Active" : "Inactive"}
              </span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );  
};
export default OurServices;
