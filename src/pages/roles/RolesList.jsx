import  { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const AlertMessage = withReactContent(Swal);
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [showView, setShowView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: 'desc',
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    status: false,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
    }, 500); 
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // =============List of all roles==============
  const fetchingRoles = async () => {
    try {
      const data = await AxiosHelper.getData("get-roles", param);
      if (data?.status) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Error while fetching roles:", error);
    }
  };

  const handleSortChange = (key, order) => {
    setParam({ ...param, orderDirection: order, orderBy: key });
  };

  // ============ Edit Data ==========
  const edit = async (event) => {
    const { _id } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      navigate(`/admin/role/edit/${_id}`);
    }
  };

  // ============View Data=============
  const viewData = async (event) => {
    var data = JSON.parse(event.currentTarget.attributes.getNamedItem("main-data").value);
    setInitialValues(data);
    setShowView(true);
  };

  // =============Delete Data===============
  const deleteRole = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
 
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`delete-role/${_id}`);
        if (data?.status) {
          fetchingRoles();
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    }
  };

  const handleClick = async (id, status) => {
    try {
      const response = await AxiosHelper.getData(`updateStatus/${'roles'}/${id}`);
      if(response?.status) {
        toast.success(`Status updated to ${status ? 'Active' : 'Inactive'}`);
        fetchingRoles()
      } else {
        toast.error(`Failed to update status: ${response?.message}`); 
      } 
    
    } catch (err) {
      console.error('Error updating status:', err);
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
      onClick: edit,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Permissions",
      module_id: "Role",
      action: "edit",
      onClick: (event) => {
        let data = JSON.parse(
          event.target.attributes.getNamedItem("main-data").value
        );
        if (data) {
          navigate(`/admin/role/permission/${data?.id}`);
        }
      },
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "Role",
      action: "delete",
      onClick: deleteRole,
      className: "w-full block bg-white text-danger",
    },
  ];
  useEffect(() => {
    fetchingRoles();
  }, [param]);

  const columns = [
    {
      key: "name",
      label: "Role Name",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{role?.name}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (role) => <StatusBadge status={role.status} data_id={role._id} onClick={handleClick} />,
    },
  ];
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
             <h4 className="text-3xl font-bold text-gray-900">Role Management</h4>
             <Link
                to="/admin/role/create"
                className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
              >
                <b>ADD NEW ROLE</b>
              </Link>
          </div>       

          <DataTable
            tabletName ={"Role List"}
            data={roles?.record}
            columns={columns}
            searchable={true}
            selectable={true}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                onEdit={edit}
                onView={viewData}
                onDelete={deleteRole}
              />
            )}
            currentPage={param?.pageNo}
            itemsPerPage={param?.limit}
            totalItems={roles?.count || 0}
            onPageChange={updateParams}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortKey={param?.orderBy}
            sortOrder={param?.orderDirection}
            onSortChange={handleSortChange}
          />
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
            View Role Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShowView(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <ul className="space-y-4">
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold">Role Name</span>
              <span>{initialValues?.name}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold">Role Status</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
                  initialValues?.status === 1 ? "bg-green-500" : "bg-red-600"
                }`}
              >
                {initialValues?.status === 1 ? "Active" : "Inactive"}
              </span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RolesList;
