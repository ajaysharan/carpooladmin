import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";

const AlertMessage = withReactContent(Swal);

const RideList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("name"); // default sort
  const [sortOrder, setSortOrder] = useState("desc"); // -1 for descending, 1 for ascending
  const [statusFilter] = useState("");
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [ride, setRides] = useState();
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // =============List of all drivers==============
  const fetchingRides = async () => {
    try {
      const data = await AxiosHelper.getData("get-rides", param, {
        pageNo: currentPage,
        limit: itemsPerPage,
        query: debouncedSearch,
        orderBy: sortKey,
        orderDirection: sortOrder,
        status: statusFilter,
      });

      if (data?.status) {
        setRides(data.data.record);
        setTotalItems(data.data.count);
      }
    } catch (error) {
      console.log("Error while fetching ride data: ", error);
    }
  };
  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      name: data?.driverDetails?.name,
      status: data?.status,
      phone: data?.driverDetails?.phone,
      passengers: data?.passengers.length,
      source: data?.fromLocation.address,
      destination: data?.toLocation.address,
      price: data?.price,
    });
    console.log("view data", data.status);
    setShow(true);
  };
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };
  // =============Delete Data===============
  const deleteUser = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`delete/rides/${_id}`);
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

  const columns = [
    {
      key: "name",
      label: "Driver Name",
      sortable: true,
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {ride?.driverDetails?.name}
          </div>
        </div>
      ),
    },
    {
      key: "passenger",
      label: "passenger",
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {ride?.passengers?.length}
          </div>
        </div>
      ),
    },
    {
      key: "sourceLocation",
      label: "  Source Location",
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {ride?.fromLocation?.address}
          </div>
        </div>
      ),
    },
    {
      key: "Destination Location",
      label: "Destination Location",
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {ride?.toLocation?.address}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Ride Status",
      render: (ride) => (
        <div className="flex items-center">
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full
              ${
                ride?.status === "completed"
                  ? "bg-green-500 text-white"
                  : ride?.status === "cancelled"
                  ? "bg-yellow-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
          >
            {ride?.status}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "price",
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{ride?.price}</div>
        </div>
      ),
    },
    {
      key: "Phone",
      label: "phone",
      render: (ride) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {ride?.driverDetails?.phone}
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSortChange = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
  };

  // ===== Handle Page Change =====
  // const handlePageChange = (pageNo) => {
  //   setParam({ ...param, pageNo });
  // };

  useEffect(() => {
    fetchingRides();
  }, [param]);

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-3xl font-bold text-gray-900">Ride Management</h4>
        </div>
        <DataTable
          tabletName={"Ride List"}
          data={ride}
          columns={columns}
          searchable={true}
          selectable={true}
          action={(item) => (
            <Action
              dropList={dropList}
              data={item}
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
          // searchTerm={searchTerm}
          // onSearchChange={setSearchTerm}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
      {/* view data modal | start */}
      <Modal
        size="md"
        show={show}
        centered
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header className="flex justify-between items-center border-b">
          <Modal.Title
            id="example-modal-sizes-title-lg"
            className="text-lg font-semibold text-gray-800"
          >
            View Ride Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShow(false)}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fa fa-close text-base"></i>
          </CloseButton>
        </Modal.Header>

        <Modal.Body className="p-4">
          <div className="space-y-4">
            {[
              { label: "Driver Name", value: initialValues?.name },
              { label: "Phone", value: initialValues?.phone },
              { label: "Passenger Requests", value: initialValues?.passengers },
              { label: "Source Location", value: initialValues?.source },
              {
                label: "Destination Location",
                value: initialValues?.destination,
              },
              // {
              //   label: "Ride Status",
              //   value: (
              //     <span className={`px-3 py-1 rounded-full text-sm font-medium
              //       ${
              //         initialValues?.status === "completed"
              //           ? "bg-green-500 text-white"
              //           : "bg-blue-500 text-white"
              //       }`}
              //     >
              //       {initialValues?.status}
              //     </span>
              //   )
              // }
              {
                label: "Ride Status",
                value: (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        initialValues?.status === "completed"
                          ? "bg-green-500 text-white"
                          : initialValues?.status === "cancelled"
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                  >
                    {initialValues?.status}
                  </span>
                ),
              },
              { label: "Price", value: initialValues?.price },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm sm:text-base border-b pb-2"
              >
                <span className="text-gray-600 font-medium">{item.label}</span>
                <span className="text-gray-900 font-semibold text-right">
                  {item.value || "--"}
                </span>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* view data modal | end */}
    </div>
  );
};

export default RideList;
