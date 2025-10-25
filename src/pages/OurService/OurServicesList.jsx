import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";


const OurServices = () => {
  const AlertMessage = withReactContent(Swal);
  const [service, setService] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [showView, setShowView] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const navigate = useNavigate();
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });
  const handleSortChange = (key, order) => {
    setParam({ ...param, orderDirection: order, orderBy: key });
  };
  // Fetching Services
  const fetchingServices = async () => {
    try {
      const data = await AxiosHelper.getData("getall-ourService", param);
      if (data?.status) {
        setService(data.data?.record);
        setTotalItems(data.data?.count || 0);
      }
    } catch (error) {
      console.error("Error while fetching Service: ", error);
    }
  };
  // Edit Service
  const editService = (event) => {
    const { _id } = JSON.parse(event.currentTarget.getAttribute("main-data"));
    if (_id) {
      navigate(`/admin/our-service/edit/${_id}`);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops
    return () => clearTimeout(delay);
  }, [searchTerm]);
  // View Service
  const viewData = (event) => {
    const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
    setInitialValues(data);
    setShowView(true);
  };
  // Delete Service
  const deleteService = async (event) => {
    const { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    if (isConfirmed) {
      const { _id } = JSON.parse(event.target.getAttribute("main-data"));
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
  // Toggle Status
  const handleClick = async (id, status) => {
    try {
      const response = await AxiosHelper.getData(
        `updateStatus/${"ourservices"}/${id}`
      );
      if (response?.status) {
        toast.success(`Status updated to ${status ? "Active" : "Inactive"}`);
        fetchingServices();
      } else {
        toast.error(`Failed to update status: ${response?.message}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  // Action Dropdown
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
  // Table Columns
  const columns = [
    {
      key: "image",
      label: "Image",
      sortable: false,
      render: (service) => (
        <img src={service?.image} alt="Service" className="h-10 w-10 rounded" />
      ),
    },
    {
      key: "heading",
      label: "Heading",
      sortable: true,
      render: (service) => (
        <div className="text-sm font-medium text-gray-900">
          {service?.heading}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (service) => (
        <div className="text-sm text-gray-700">{service?.description}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,     
      render: (service) => (
        <div className="flex items-center w-24">
        <StatusBadge
          status={service?.status}
          data_id={service?._id}
          onClick={handleClick}
        />
      </div>
      ),
    },
  ];
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };
  useEffect(() => {
    fetchingServices();
  }, [debouncedSearch, param]);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-3xl font-bold text-gray-900">
            Our Services Management
          </h4>
          <Link
            to="/admin/our-service/create"
            className="px-4 py-2 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white">
            <b>Add New Services</b>
          </Link>
        </div>
        <DataTable
          tabletName="Service List"
          data={service}
          columns={columns}
          searchable={true}
          selectable={true}
          action={(item) => (
            <Action
              dropList={dropList}
              data={item}
              onEdit={editService}
              onView={viewData}
              onDelete={deleteService}
            />
          )}
          currentPage={param?.pageNo}
          itemsPerPage={param?.limit}
          totalItems={totalItems}
          onPageChange={updateParams}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSortChange={handleSortChange}                 
        />
        {/* View Modal (Optional) */}
        <Modal
          size="md"
          show={showView}
          centered={true}
          onHide={() => setShowView(false)}
          aria-labelledby="example-modal-sizes-title-lg" >
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-lg">
              View OurServices Details
            </Modal.Title>
            <CloseButton
              onClick={() => setShowView(false)}
              className=" text-red-500 flex items-center justify-center">
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
                <label className="fs-6 m-0 font-bold pe-5">Description</label>
                <span className="fs-6">{initialValues?.description}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <label className="fs-6 m-0 font-bold">Image</label>
                {initialValues?.image ? (
                  <img
                    src={initialValues.image}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxWidth: "100px", maxHeight: "60px" }}
                  />
                ) : (
                  <span className="fs-6 text-muted">No image</span>
                )}
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <label className="fs-6 m-0 font-bold">Service Status</label>
                <span
                  className={`rounded-full text-sm px-2 py-1 ${
                    initialValues?.status === 1
                      ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                      : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                  }`} >
                  {initialValues?.status === 1 ? "Active" : "Inactive"}
                </span>
              </li>
            </ul>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
export default OurServices;
