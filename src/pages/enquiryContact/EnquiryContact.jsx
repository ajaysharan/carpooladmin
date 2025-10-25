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

const Enquiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("name"); 
  const [sortOrder, setSortOrder] = useState("asc");
  const [show, setShow] = useState(false);
  const [enquiry, setEnquiry] = useState([]);
  const [initialValues, setInitialValues] = useState({});

  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });
  const columns = [
    {
      key: "name",
      label: " Name",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{role?.name}</div>
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
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {role?.subject}
          </div>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {role?.message}
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // =============List of all drivers==============
  const fetchingEnquiry = async () => {
    try {
      const data = await AxiosHelper.getData("get-enquiry",param);      
      if (data?.status) {
        setEnquiry(data.data.record);
        setTotalItems(data.data.count);
      }
    } catch (error) {
      console.log("Error while fetching Enquirys data: ", error);
    }
  };
  // ========== SORTING ========== 
  const handleSortChange = (key, order) => {
    
    setParam({...param, orderDirection:order, orderBy: key})
    setSortOrder(key == 'asc' ? 'desc':'asc')
  };
  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      name: data?.name,
      email: data?.email,
      subject: data?.subject,
      phone: data?.phone,
      message: data?.message,
    });
    setShow(true);
  };
  const updateParams = (page) => {
    setParam({...param, pageNo:page})
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
        const data = await AxiosHelper.deleteData(`delete-enquiry/${_id}`);
        if (data?.status) {
          fetchingEnquiry();
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    }
  };
  // ========Actions===========
  const dropList = [
    { name: "View",
      module_id: "User",
      onClick: viewData,
      className: "w-full block bg-white text-slate-800",
    },
    { name: "Delete",
      module_id: "User",
      action: "delete",
      onClick: deleteUser,
      className: "w-full block bg-white text-danger ",
    },
  ];
    useEffect(() => {
      const delay = setTimeout(() => {
        setParam({...param, query:searchTerm})
        setDebouncedSearch(searchTerm);
      }, 500); 
      return () => clearTimeout(delay);
    }, [searchTerm]);
    
  useEffect(() => {
    fetchingEnquiry();
  }, [param]);
  return (
    <>
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-3xl font-bold text-gray-900">
            Enquiry Management
          </h4>
        </div>
        <DataTable
          tabletName={"Enquiry List"}
          data={enquiry}
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
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

     
    </div>
    <Modal
        size="md"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Passenger Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShow(false)}
            className=" text-red-500 flex items-center justify-center">
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Name</label>
              <span className="fs-6">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Email</label>
              <span className="fs-6"> {initialValues.email}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Subject </label>
              <span className="fs-6">{initialValues.subject}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Phone</label>
              <span className="fs-6"> {initialValues.phone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0 pe-6">message</label>
              <span className="fs-6"> {initialValues.message}</span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Enquiry;
