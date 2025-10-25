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

const AlertMessage = withReactContent(Swal);

const NotificationList = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  const deleteNotification = async (event) => {
    const { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    if (isConfirmed) {
      const { _id } = JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`notifications-delete/${_id}`);
        if (data?.status) {
          toast.success(data?.message);
          fetchNotifications();
        } else {
          toast.error(data?.message);
        }
      }
    }
  };
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await AxiosHelper.getData("send-notification", param);
      if (data?.status) {
        const { record, count } = data.data;
        setNotifications(record || []);
        setTotalItems(count || 0);
      } else {
        toast.error(data?.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error while fetching notifications:", error);
    }
  };

  const handleSortChange = (key, order) => {
    setParam({ ...param, orderDirection: order, orderBy: key });
  };


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
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setParam((prev) => ({ ...prev, query: searchTerm, pageNo: 1 }));
    }, 500); // Add debounce to avoid rapid calls
  
    return () => clearTimeout(timeout);
  }, [searchTerm]);
  useEffect(() => {
    fetchNotifications();
  }, [param]);

  const dropList = [
    {
      name: "View",
      module_id: "User",
      action: "View",
      onClick: viewNotification,
      className: "w-full block bg-white text-black",
    },
    {
      name: "Delete",
      module_id: "User",
      action: "delete",
      onClick: deleteNotification,
      className: "w-full block bg-white text-danger",
    },

  ];
  const columns = [
    {
      key: "heading",
      label: "Heading",
      sortable: true,
      render: (notification) => (
        <div className="text-sm font-medium text-gray-900">
          {notification?.heading}
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      sortable: true,
      render: (notification) => (
        <div className="text-sm text-gray-800">{notification?.message}</div>
      ),
    },
    {
      key: "link",
      label: "Link",
      sortable: true,
      render: (notification) => (
        <a
          href={notification?.link}
          className="text-black underline text-sm "
          target="_blank"
          rel="noopener noreferrer"
        >
             {notification?.link}
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-3xl font-bold text-gray-900">Notification List</h4>
            <Link
              to="/admin/notification/create"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white shadow-sm"
            >
              <b>Add New Notification</b>
            </Link>
          </div>
          <DataTable
            tabletName={"Notification List"}
            data={notifications}
            columns={columns}
            searchable={true}
            selectable={true}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                onView={viewNotification}
                onDelete={deleteNotification}
              />
            )}
            currentPage={param?.pageNo}
            itemsPerPage={param?.limit}
            totalItems={totalItems}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortKey={param?.orderBy}
            sortOrder={param?.orderDirection }
            onSortChange={handleSortChange}
          />
        </div>
      </div>      
    </>
  );
};
export default NotificationList;
