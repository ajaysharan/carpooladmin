import { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";
import MyForm from "../../components/Common/MyForm";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constants/fromConfig";

const AlertMessage = withReactContent(Swal);

const State = () => {
  const [states, setStates] = useState({});
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [errors, setErrors] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter] = useState("");
  const navigate = useNavigate();

  const [param, setParam] = useState({
    limit: itemsPerPage,
    pageNo: currentPage,
    query: searchTerm,
    orderBy: sortKey,
    orderDirection: sortOrder === "asc" ? 1 : -1,
    status: statusFilter,
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    country: "",
    state_code: "",
    title: "",
    description: "",
  });

  const [initialValuesSchema, setInitialValuesSchema] = useState({
    id: "",
    name: "",
    image: "",
    banner: "",
    title: "",
    description: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    title: Yup.string(),
    description: Yup.string(),
    banner: Yup.mixed()
      .test("fileSize", "File too large", (value) =>
        value && typeof value !== "string" ? value.size <= FILE_SIZE : true
      )
      .test("fileFormat", "Unsupported Format.", (value) =>
        value && typeof value !== "string"
          ? SUPPORTED_FORMATS_IMAGE.includes(value.type)
          : true
      ),
    image: Yup.mixed()
      .test("fileSize", "File too large", (value) =>
        value && typeof value !== "string" ? value.size <= FILE_SIZE : true
      )
      .test("fileFormat", "Unsupported Format.", (value) =>
        value && typeof value !== "string"
          ? SUPPORTED_FORMATS_IMAGE.includes(value.type)
          : true
      ),
  });

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch data
  const fetchStates = async () => {
    try {
      const queryParams = {
        ...param,
        pageNo: currentPage,
        limit: itemsPerPage,
        query: debouncedSearch,
        orderBy: sortKey,
        orderDirection: sortOrder === "asc" ? 1 : -1,
      };
      const data = await AxiosHelper.getData("state", queryParams);
      if (data?.status === true) {
        const { count, totalPages, record, pagination } = data.data;
        setStates({ count, totalPages, record, pagination });
        setTotalItems(count);
      }
    } catch (error) {
      console.error("ERROR WHILE FETCHING STATES: ", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, [
    debouncedSearch,
    currentPage,
    itemsPerPage,
    sortKey,
    sortOrder,
    statusFilter,
  ]);

  const editData = async (event) => {
    const { _id, name, image, banner, title, description } = JSON.parse(
      event.currentTarget.getAttribute("main-data")
    );
    setInitialValuesSchema({
      id: _id,
      name,
      image,
      banner,
      title,
      description,
    });
    setEditShow(true);
  };

  const viewData = async (event) => {
    const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
    setInitialValues({
      name: data?.name,
      country: data?.country_name,
      state_code: data?.state_code,
      title: data?.title,
      description: data?.description,
    });
    setShow(true);
  };
  const fields = [
    {
      label: "State Name",
      name: "name",
      type: "text",
      col: 12,
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      col: 12,
    },
    {
      label: "Description",
      name: "description",
      type: "text-editer",
      col: 12,
    },
    {
      label: "Image",
      name: "image",
      type: "file",
      col: 6,
    },
    {
      label: "Banner",
      name: "banner",
      type: "file",
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
      className: "btn-theme text-sm text-white rounded px-2 py-1 my-4",
    },
  ];
  const handleSortChange = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
  };

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
      onClick: editData,
      className: "w-full block bg-white text-slate-400",
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Image",
      // sortable: true,
      render: (row) => (
        <img
          src={row.image}
          alt="Thumbnail"
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop
            e.target.src =
              "http://localhost:5174/src/assets/img/flag-fallback-image.png";
          }}
        />
      ),
    },
    {
      key: "name",
      label: "State Name",
      sortable: true,
      render: (state) => (
        <div className="text-sm font-medium text-gray-900">{state?.name}</div>
      ),
    },
    {
      key: "country",
      label: "country Name",
      sortable: true,
      render: (state) => (
        <div className="text-sm font-medium text-gray-900">
          {" "}
          {state?.country_name}
        </div>
      ),
    },
    {
      key: "state_code",
      label: "State Code",
      sortable: true,
      render: (state) => (
        <div className="text-sm font-medium text-gray-900">
          {state?.state_code}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge
          status={row.status}
          data_id={row._id}
          onClick={handleClick}
        />
      ),
    },
  ];
  const handleClick = async (id, status) => {
    try {
      const response = await AxiosHelper.getData(`updateStatus/states/${id}`);
      if (response?.status) {
        toast.success(`Status updated to ${status ? "Active" : "Inactive"}`);
        fetchStates();
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-3xl font-bold text-gray-900">
              State Management
            </h4>
          </div>
          <DataTable
            tabletName="State List"
            data={states?.record || []}
            columns={columns}
            searchable={true}
            selectable={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                onEdit={editData}
                onView={viewData}
              />
            )}
          />
        </div>
      </div>
      <Modal
        size="lg"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            State Details
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
              <label className="fs-6 m-0 font-bold">Name</label>
              <span className="fs-6">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Country</label>
              <span className="fs-6">{initialValues?.country}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">State Code</label>
              <span className="fs-6">{initialValues?.state_code}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Title</label>
              <span
                className="fs-6"
                dangerouslySetInnerHTML={{
                  __html: initialValues?.title ? initialValues?.title : "--",
                }}
              ></span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Description</label>
              <span
                className="fs-6 px-3 text-justify"
                dangerouslySetInnerHTML={{
                  __html: initialValues?.description
                    ? initialValues?.description
                    : "--",
                }}
              ></span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* view data modal | End */}

      {/* edit Form Data | Start */}
      <Modal
        size="lg"
        show={editShow}
        centered={true}
        onHide={() => setEditShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Edit State Details
          </Modal.Title>
          <CloseButton
            onClick={() => setEditShow(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative">
            <MyForm
              errors={errors}
              fields={fields}
              initialValues={initialValuesSchema}
              validSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const formData = new FormData();
                  Object.keys(values).forEach((key) => {
                    formData.append(key, values[key]);
                  });
                  const data = await AxiosHelper.putData(
                    `state/${initialValuesSchema.id}`,
                    formData,
                    true
                  );
                  if (data?.status) {
                    toast.success("Updated State data successfully!");
                    setEditShow(false);
                    fetchStates();
                  }
                } catch (error) {
                  toast.error("Something went wrong");
                  setErrors(error);
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default State;
