import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DataTable } from "../../components/DataTable/DataTable";
const AlertMessage = withReactContent(Swal);
import { CURRENCY } from "../../constants/fromConfig"

const BookingList = () => {
  const MySwal = withReactContent(Swal);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [bookings, setBookings] = useState();
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: 'desc',
  });

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

  // =============List of all drivers==============
  const fetchingBookings = async () => {
    try {
      const data = await AxiosHelper.getData("get-bookings", param);
      if (data?.status) {
        setBookings(data.data);
      }
    } catch (error) {
      console.log("Error while fetching booking data: ", error);
    }
  };

  const handleSortChange = (key, order) => {
    setParam({ ...param, orderDirection: order, orderBy: key });
  };
  
  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
    }, 500); 
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleStatus = async (id, status) => {
    const result = await MySwal.fire({
      title: `Are you sure you want to change the status to "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
        okBUtton:"swal-ok"
      },
    });

    if (result.isConfirmed) {
      try {
        const data = await AxiosHelper.putData(`update-booking-status/${id}`,{
            status: status,
            cancelledBy: status === "cancelled" ? "system" : null,
          },false);

        if (data?.status === true) {
          MySwal.fire("Updated!",
            "Booking status updated successfully.",
            "success"
          );
          fetchingBookings();
        } else {
          MySwal.fire(
            "Error!",
            "Something went wrong while updating.",
            "error"
          );
        }
      } catch (error) {
        console.error("ERROR OCCURRED WHILE UPDATING DATA: ", error);
        MySwal.fire(
          "Error!",
          "An error occurred while updating status.",
          "error"
        );
      }
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
 
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
    
      if (_id) {
    
        const data = await AxiosHelper.deleteData(`delete/bookings/${_id}`);
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

  const handleClick = async (id, paymentStatus) => {
    try {
      const response = await AxiosHelper.getData(`verify-payment/${id}/${paymentStatus}`);
      if (response?.status) {
        toast.success(`Status updated to ${paymentStatus}`);
        fetchingBookings(); // Refresh list
      } else {
        toast.error(`Failed to update status: ${response?.message}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Something went wrong!");
    }
  };

  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };

  const columns = [
    {
      key: "driver ",
      label: "Driver Name",
      sortable: true,
      render: (bookings) => (
        <div className="items-center">
          <div className="text-sm font-medium text-gray-900">
            {bookings?.driverDetails?.name}
          </div>
          <div className="d-flex gap-1 items-center text-sm font-medium text-blue-900">
            <i className="fa fa-phone"></i> {bookings?.driverDetails?.phone}
          </div>
        </div>
      ),
    },
    {
      key: "passenger",
      label: "Passenger Name",
      sortable: true,
      render: (bookings) => (
        <div className="items-center">
          <div className="text-sm font-medium text-gray-900">
            {bookings?.passengerDetails?.name}
          </div>
          <div className="d-flex gap-1 items-center text-sm font-medium text-blue-900">
            <i className="fa fa-phone"></i> {bookings?.passengerDetails?.phone}
          </div>
        </div>
      ),
    },
   
    {
      key: "totalPrice",
      label: "Payment",
      sortable: true,
      render: (bookings) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
             {CURRENCY} { bookings?.totalPrice}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Booking Status",
      render: (booking) => (
        <select
          value={booking?.status}
          className={`focus:border-none focus:outline-none cursor-pointer !font-bold !text-[12px] rounded p-1 capitalize
          ${booking?.status === "pending"
              ? "bg-gradient-to-b from-yellow-400 to-yellow-600 text-black"
              : booking?.status === "ongoing"
              ? "bg-gradient-to-br from-blue-400 to-blue-700 text-white"
              : booking?.status === "confirmed"
              ? "bg-gradient-to-br from-green-600 to-lime-400 text-white"
              : booking?.status === "cancelled"
              ? "bg-gradient-to-tr from-red-400 to-red-600 text-white"
              : booking?.status === "completed"
              ? "bg-gradient-to-bl from-green-700 to-lime-400 text-white"
              : "bg-gray-300 text-black"
          }
        `}
          onChange={(e) => handleStatus(booking?.ride, e.target.value)}
        >
          {["pending", "confirmed", "ongoing", "cancelled", "completed"].map(
            (status, index) => (
              <option key={index} value={status} className="text-black">
                {status}
              </option>
            )
          )}
        </select>
      ),
    },
 {
  key: "paymentStatus",
  label: "Payment Status",
  sortable: true,
  render: (booking) => (
    <div className="text-sm capitalize pl-4">
      <select
        value={booking?.paymentStatus}
        onChange={(e) => handleClick(booking?._id, e.target.value)}
      
        className={`focus:border-none focus:outline-none cursor-pointer !font-bold !text-[12px] rounded p-1 capitalize ${
            booking?.paymentStatus === 'completed'
              ? 'bg-gradient-to-tl from-green-600 to-lime-400 text-white'
              : booking?.paymentStatus === 'pending'
              ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-black'
              : booking?.paymentStatus === 'refunded'
              ? 'bg-gradient-to-bl from-blue-400 to-blue-700 text-white'
              : 'bg-gray-300 text-black'
          }`}
      >
        {["pending", "completed", "refunded"].map((status, index) => (
          <option key={index} value={status} className="text-black">
            {status}
          </option>
        ))}
      </select>
    </div>
  ),
}

  ];

  useEffect(() => {
    fetchingBookings();
  }, [param]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-3xl font-bold text-gray-900">
              Booking Management
            </h4>
          </div>
          <DataTable
            tabletName={"Booking List"}
            data={bookings?.record}
            columns={columns}
            searchable={true}
            selectable={true}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                // onEdit={edit}
                onView={viewData}
                onDelete={deleteBooking}
              />
            )}
            currentPage={param?.pageNo}
            itemsPerPage={param?.limit}
            totalItems={bookings?.count || 0}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortKey={param?.orderBy}
            sortOrder={param?.orderDirection}
            onSortChange={handleSortChange}
          />
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
    </>
  );
};

export default BookingList;
