import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PermissionBlock from "../../components/PermissionBlock";


const AlertMessage = withReactContent(Swal);

const NotificationList = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  const [initialValues, setInitialValues] = useState({
    heading: "",
    message: "",
    type: "",
    link: "",
    attachment: "",
    fullName: "",
    email: "",
    employeeId: "N/A",
  });

    // Delete notification
  const deleteNotification = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`notifications-delete/${_id}`);
        if (data?.status) {
          fetchingNotifications();
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    }
  };
  const dropList = [        
        {
          name: "Delete",
          module_id: "User",
          action: "delete",
          onClick: deleteNotification,
          className: "w-full block bg-white text-danger",
        },
      ];

  // Fetch notifications
  const fetchingNotifications = async () => {
    try {
        const data = await AxiosHelper.getData("send-notification", param);
        console.log("Fetched notifications data:", data); // Log the data
        if (data?.status) {
            let { count, totalPages, record, pagination } = data.data;
            setNotifications({ count, totalPages, record, pagination });
        } else {
            toast.error(data?.message || "Failed to fetch notifications");
        }
    } catch (error) {
        console.log("Error while fetching notifications: ", error);
    }
};

  // View notification data
  const viewNotification = (event) => {
    try {
      const rawData = event.currentTarget.getAttribute("send-notification");
      if (!rawData) return;

      const data = JSON.parse(rawData);
      setInitialValues({
        heading: data?.heading || "",
        message: data?.message || "",
        type: data?.type || "",
        link: data?.link || "",
        attachment: data?.attachment || "",
        fullName: data?.fullName || "",
        email: data?.email || "",
        employeeId: data?.employeeId || "N/A",
      });

      setShow(true);
    } catch (error) {
      console.error("Invalid notification data", error);
    }
  };
  // Handle page change
  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };

  useEffect(() => {
    fetchingNotifications();
  }, [param]);
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Manage Notifications</h6>
            <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
              <Link to={`/`} className="me-2 text-slate-700">
                <i className="fa fa-home me-1"></i>
                <span className="d-none d-sm-inline-block ms-1 ">Dashboard</span>
              </Link>
              <PermissionBlock module={"User"} action={"add"}>
                <button className="text-sm btn-theme text-white rounded px-2 py-1">
                  <Link to={`/admin/notification/create`}>Add Notification</Link>
                </button>
              </PermissionBlock>
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
                    <th className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer">
                      <span>Heading</span>
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Message
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Link
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications?.record?.length > 0 &&
                    notifications?.record?.map((notification, index) => (
                      <tr key={index}>
                        <td
                          className="p-1 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer"
                          main-data={JSON.stringify(notification)}
                          onClick={viewNotification}                        >
                          <h6 className="mb-0 leading-normal text-sm capitalize pl-4 text-primary">
                            {notification?.heading}
                          </h6>
                        </td>
                        <td className="p-1 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <h6 className="mb-0 leading-normal text-sm pl-4 ">
                            {notification?.message}
                          </h6>
                        </td>
                        <td className="p-1 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <h6 className="mb-0 leading-normal text-sm pl-4 ">
                            {notification?.link}
                          </h6>
                        </td>
                        <td className="p-1 align-middle bg-transparent border-b whitespace-nowrap">
                          <Action dropList={dropList} data={notification} />
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
                    {param.pageNo * param.limit > notifications?.count
                      ? notifications?.count
                      : param.pageNo * param.limit}{" "}
                    of {notifications?.count}
                  </span>
                </p>
              </div>
              <div className="w-auto flex items-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(notifications?.pagination[0])}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {notifications?.pagination?.map((row) => {
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
                        notifications?.pagination[notifications?.pagination.length - 1]
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

      {/* View Notification Modal */}
      <Modal
        size="md"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">View Notification</Modal.Title>
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
              <label className="fs-6 m-0 font-bold">Heading</label>
              <span className="fs-6">{initialValues?.heading}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Message</label>
              <span className="fs-5">{initialValues?.message}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Link</label>
              <span className="fs-5">{initialValues?.link}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Type</label>
              <span className="fs-5">{initialValues?.type}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Full Name</label>
              <span className="fs-6">{initialValues?.fullName}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Email</label>
              <span className="fs-6">{initialValues?.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Employee ID</label>
              <span className="fs-6">{initialValues?.employeeId}</span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* View Notification Modal End */}
    </div>
  );
};

export default NotificationList;
