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

const BookingList = () => {
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({
    driver: "",
    passenger: "",
    driverPhone: "",
    passengerPhone: "",
    date: "",
    paymentStatus: "",
    paymentMethod: "",
    payment: "",
    bookingStatus: "",
  });
  const [bookings, setBookings] = useState({
    count: 0,
    current_page: 1,
    totalPages: 0,
    pagination: [],
    record: [],
  });
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // =============List of all drivers==============
  const fetchingBookings = async () => {
    try {
      const data = await AxiosHelper.getData("get-bookings", param);
      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setBookings({ count, totalPages, record, pagination });
      }
    } catch (error) {
      console.log("Error while fetching booking data: ", error);
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
  const handleStatus = async (id, status) => {
    try {
      const data = await AxiosHelper.putData(
        `update-booking-status/${id}`,
        {
          status: status,
          cancelledBy: status === "cancelled" ? "system" : null,
        },
        false
      );
      console.log("Data: ", data);
      if (data?.status === true) {
        toast.success("Status updated successfully!");
        fetchingBookings();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.log("ERROR OCCURRED WHILE UPDATING DATA: ", error);
    }
  };

  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );

    setInitialValues({
      driver: data?.driverDetails?.name,
      passenger: data?.passengerDetails?.name,
      driverPhone: data?.driverDetails?.phone,
      passengerPhone: data?.passengerDetails?.phone,
      date: data?.createdAt.slice(0, 10),
      paymentStatus: data?.paymentStatus,
      paymentMethod: data?.paymentMethod,
      payment: data?.totalPrice,
      bookingStatus: data?.status,
    });
    setShow(true);
  };

  // =============Delete Data===============

  const deleteBooking = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`user/${_id}`);
        if (data?.status) {
          fetchingBookings();
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
      module_id: "Booking",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "Booking",
      action: "delete",
      onClick: deleteBooking,
      className: "w-full block bg-white text-danger",
    },
  ];

  //   ===== Handle Page Change =====
  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };
  useEffect(() => {
    fetchingBookings();
  }, [param]);

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Manage Bookings </h6>
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
                {[10, 20, 50].map((row) => (
                  <option key={row} value={row}>
                    {row}
                  </option>
                ))}
              </select>
              <span className="ps-1">Entries</span>
            </div>
            <div className="w-1/2 flex items-center">
              <input
                placeholder="Search..."
                onChange={(e) =>
                  setParam({ ...param, query: e.target.value, pageNo: 1 })
                }
                type="search"
                id="search"
                className="shadow-none form-control form-control-sm"
              />
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
                      onClick={handelSort}
                    >
                      <span>Driver Name</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Passenger Name
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Driver's Phone No.
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Passengers's Phone No.
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Date
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Payment Status
                    </th>{" "}
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Payment Mode
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Payment
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Booking Status
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.record.length > 0 &&
                    bookings?.record?.map((booking, index) => (
                      <tr key={index}>
                        <td
                          className="px-2 py-1 text-sm cursor-pointer align-middle border-b"
                          main-data={JSON.stringify(booking)}
                          onClick={viewData}
                        >
                          <h6 className="mb-0 leading-normal text-sm capitalize text-primary">
                            {booking?.driverDetails?.name}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm capitalize">
                            {booking?.passengerDetails?.name}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm">
                            {booking?.driverDetails?.phone}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm">
                            {booking?.passengerDetails?.phone}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm">
                            {booking?.createdAt.slice(0, 10)}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm capitalize pl-4">
                            <span
                              className={`text-xs rounded-full px-2 py-1 font-semibold cursor-pointer ${
                                booking?.paymentStatus === "completed"
                                  ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                                  : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                              }`}                            >
                              {booking?.paymentStatus}
                            </span>
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm">
                            {booking?.paymentMethod}
                          </h6>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <h6 className="mb-0 leading-normal text-sm">
                            {booking?.totalPrice}
                          </h6>
                        </td>
                        <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <select
                            value={booking?.status}
                            className={`focus:border-none focus:outline-none cursor-pointer !font-bold !text-[12px] rounded p-1 capitalize ${
                              ["confirmed", "ongoing", "completed"].includes(
                                booking?.status
                              )
                                ? "bg-gradient-to-tl from-green-600 to-lime-400 text-white"
                                : "bg-gradient-to-b from-red-400 to-red-600  text-white"
                            }`}
                            onChange={(e) =>
                              handleStatus(booking?.ride, e.target.value)
                            }
                          >
                            {[
                              "pending",
                              "confirmed",
                              "ongoing",
                              "cancelled",
                              "completed",
                            ].map((status, index) => (
                              <option
                                key={index}
                                value={status}
                                className="text-black"
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-700 align-middle border-b">
                          <Action dropList={dropList} data={booking} />
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
                    {param.pageNo * param.limit > bookings?.count
                      ? bookings?.count
                      : param.pageNo * param.limit}{" "}
                    of {bookings?.count}
                  </span>
                </p>
              </div>
              <div className="w-auto flex items-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    dd="disabled"
                    className=" btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(bookings?.pagination[0])}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {bookings?.pagination?.map((row) => {
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
                        bookings?.pagination[bookings?.pagination.length - 1]
                      )
                    }
                  >
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
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Booking Details
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
              <span className="fs-6">{initialValues?.driver}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Passenger Name</label>
              <span className="fs-6">{initialValues?.passenger}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Driver Phone Number</label>
              <span className="fs-6">{initialValues?.driverPhone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">
                Passenger Phone Number
              </label>
              <span className="fs-6">{initialValues?.passengerPhone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Booking Date</label>
              <span className="fs-6">{initialValues?.date}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Payment Status</label>
              <span
                className={`text-xs rounded-full px-2 py-1 font-semibold cursor-pointer align-middle capitalize ${
                  initialValues?.paymentStatus === "completed"
                    ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                    : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                }`}
              >
                {initialValues?.paymentStatus}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Payment Method</label>
              <span className="fs-6">{initialValues?.paymentMethod}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Payment Amount</label>
              <span className="fs-6">{initialValues?.payment}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Booking status</label>
              <span className="fs-6">
                <h6 className="align-middle mb-0 leading-normal text-sm capitalize pl-4">
                  <span
                    className={`text-xs rounded-full px-2 py-1 font-semibold cursor-pointer ${
                      ["confirmed", "ongoing", "completed"].includes(
                        initialValues?.bookingStatus
                      )
                        ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                        : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                    }`}
                  >
                    {initialValues?.bookingStatus}
                  </span>
                </h6>
              </span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* view data modal | end */}
    </div>
  );
};

export default BookingList;
