import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const AlertMessage = withReactContent(Swal);

const RideList = () => {
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({ 
    name: "",
    phone: "",
    passengers: 0,    
    source: "",
    destination: "",
    estimatedDistance: "",
    estimatedDuration: "",
    price: 0,
    
  });
  const [rides, setRides] = useState();
  const [param, setParam] = useState({
    limit: 5,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // =============List of all drivers==============
  const fetchingRides = async () => {
    try {
      const data = await AxiosHelper.getData("get-rides", param);
      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setRides({ count, totalPages, record, pagination });
      }
    } catch (error) {
      console.log("Error while fetching rides data: ", error);
    }
  };

  // ========== SORTING ==========
  const handelSort = (event) => {
    var orderBy =
      event.currentTarget.attributes.getNamedItem("data-sort").value;
    if (param?.orderBy !== orderBy) {
      setParam({ ...param, orderBy });
    } else {
      setParam({ ...param, orderDirection: param?.orderDirection * -1 });
    }
  };

  // ====== Handle Status update=======
  // const handleStatus = async (id, status) => {
  //   try {
  //     const response = await AxiosHelper.putData(`update-ride-status/${id}`, {
  //       status,
  //     });
  //     console.log("response", response.data);
  //     if (response?.status === true) {
  //       toast.success("Status updated successfully!");
  //       fetchingRides();
  //     } else {
  //       toast.error("Something went wrong.");
  //     }
  //   } catch (error) {
  //     console.error("ERROR OCCURRED WHILE UPDATING DATA: ", error);
  //     toast.error("Failed to update status.");
  //   }
  // };


  const handleStatus = async (id, status) => {
    console.log("Sending ride_id:", id); // 👈 add this
  
    try {
      const response = await AxiosHelper.putData(`update-ride-status/${id}`, { status });
      console.log("response", response.data);
  
      if (response?.data?.status === true) {
        toast.success("Status updated successfully!");
        fetchingRides();
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("ERROR OCCURRED WHILE UPDATING DATA:", error);
      toast.error("Failed to update status.");
    }
  };  
  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      name: data?.driverDetails?.name,
      phone: data?.driverDetails?.phone,
      passengers: data?.passengers.length,
      source: data?.fromLocation.address,
      destination: data?.toLocation.address,
      estimatedDistance: data?.estimatedDistance.text,
      estimatedDuration: data?.estimatedDuration.text,
      price: data?.price,
    });
    setShow(true);
  };
  // =============Delete Data===============

  const deleteRide = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`deleteRide/${_id}`);     
        if (data?.status) {
          fetchingRides();
          toast.success(data?.message);
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
      module_id: "Ride",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "Ride",
      action: "delete",
      onClick: deleteRide,
      className: "w-full block bg-white text-danger",
    },
  ];
  //   ===== Handle Page Change =====
  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };useEffect(() => {
    fetchingRides();
  }, [param]);
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Manage Rides </h6>
            <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
              <Link to={`/`} className="me-2 text-slate-700">
                <i className="fa fa-home me-1"></i>
                <span className="d-none d-sm-inline-block ms-1 ">
                  Dashboard
                </span>
              </Link>
            </div>
          </div>
          <div className="my-2 p-2 flex items-center justify-between">
            <div className="w-1/2 flex items-center gap-2">
              <select
                className="w-auto form-select form-select-sm cursor-pointer"
                onChange={(e) => setParam({ ...param, limit: e.target.value })}
              >
                {[5,10, 20, 50].map((row) => (
                  <option key={row} value={row}>
                    {row}
                  </option>
                ))}
              </select>
              <span className="ps-1">Entries</span>
            </div>
            <div className="w-1/2 flex items-center">
              <input
                placeholder="Search by address ..."
                onChange={(e) =>
                  setParam({ ...param, query: e.target.value, pageNo: 1 })}
                type="search"
                id="search"
                className="shadow-none form-control form-control-sm"/>
            </div>
          </div>
          <div className="flex-auto px-0 pt-0 pb-2">
            <div className="p-2 overflow-x-auto table-responsive">
              <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                <thead className="align-bottom thead-light">
                  <tr>
                    <th
                      className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="name"
                      onClick={handelSort} >
                      <span>Driver</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Passenger Requests
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Phone
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Source Location
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      destination Location
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Ride status
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rides?.record.length > 0 &&
                    rides?.record?.map((ride, index) => (
                      <tr key={index}>   
                        <td
                          className="px-2 py-1 text-sm cursor-pointer align-middle border-b"
                          main-data={JSON.stringify(ride)}
                          onClick={viewData}>
                          <h6 className="mb-0 leading-normal text-sm capitalize text-primary">
                            {ride?.driverDetails?.name}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm capitalize text-center">
                            {ride?.passengers?.length}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm capitalize">
                            {ride?.driverDetails?.phone}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm text-center">
                            {ride?.fromLocation?.address}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm text-center">
                            {ride?.toLocation?.address}
                          </h6>
                        </td>
                        <td
                          className="px-2 py-1 text-sm text-gray-700 align-middle border-b cursor-pointer"
                         
                          // onClick={() => {
                          //   const status =
                          //     ride?.status === "active"
                          //       ? "cancelled"
                          //       : "active";
                          //   handleStatus(ride?._id, status);
                          // }}
                        >
                          <h6 className="mb-0 leading-normal text-sm text-center">
                            <span
                              className={`rounded-full font-normal px-3.5 py-2 inline-block whitespace-nowrap text-white text-xs capitalize ${
                                ride?.status === "active"
                                  ? "bg-gradient-to-tl from-green-600 to-lime-400"
                                  : ride?.status === "completed"
                                  ? "bg-gradient-to-tl from-blue-600 to-cyan-400"
                                  : "bg-gradient-to-tl from-red-500 to-pink-400"
                              }`}>
                              {ride?.status}
                            </span>
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <Action dropList={dropList} data={ride} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between py-1 px-2">
              <div className="w-auto">
                <p className="mb-0 fs-6">
                  <span
                    className="d-none d-sm-inline-block"
                    data-list-info="data-list-info"
                  >
                    {(param.pageNo - 1) * param.limit + 1} to{" "}
                    {param.pageNo * param.limit > rides?.count
                      ? rides?.count
                      : param.pageNo * param.limit}{" "}
                    of {rides?.count}
                  </span>
                </p>
              </div>
              <div className="w-auto flex items-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    dd="disabled"
                    className=" btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(rides?.pagination[0])}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination text-red-700 mb-0 mx-1">
                    {rides?.pagination?.map((row) => {
                      return (
                        <li key={row}>
                          <button
                            onClick={() => handlePageChange(row)}
                            type="button"
                            className={`page me-1 btn btn-sm ${
                              row === param?.pageNo
                                ? "border border-blue-500 shadow-lg rounded"
                                : "border border-slate-700 shadow-lg rounded"
                            }`}
                          >
                            {row}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    className="btn btn-falcon-default btn-sm"
                    onClick={() =>
                      handlePageChange(
                        rides?.pagination[rides?.pagination.length - 1])}>
                    <span className="fas fa-chevron-right"> </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   {/* view data modal  | Start */}
      <Modal
        size="md"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg" >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Ride Details
          </Modal.Title>
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
              <label className="fs-6 font-bold m-0">Driver Name</label>
              <span className="fs-6">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Phone</label>
              <span className="fs-6">{initialValues?.phone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Passenger requests</label>
              <span className="fs-6">{initialValues?.passengers}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Source Location</label>
              <span className="fs-6">{initialValues?.source}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Destination Location</label>
              <span className="fs-6">{initialValues?.destination}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Estimated Distance</label>
              <span className="fs-6">{initialValues?.estimatedDistance}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Estimated Duration</label>
              <span className="fs-6">{initialValues?.estimatedDuration}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Price</label>
              <span className="fs-6">{initialValues?.price}</span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* view data modal | end */}
    </div>
  );
};
export default RideList;
