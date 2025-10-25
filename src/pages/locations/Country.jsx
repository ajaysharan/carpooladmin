import React, { useEffect, useState } from "react";
import AxiosHelper from "../../helper/AxiosHelper";
import { Link } from "react-router-dom";
import { Modal, CloseButton } from "react-bootstrap";
import Action from "../../components/Table/Action";
import MyForm from "../../components/Common/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constants/fromConfig";
import { DataTable } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/DataTable/StatusBadge";
// import StatusBadge from "../../components/Table/StatusBadge";

const Country = () => {
  const [errors, setErrors] = useState();
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // must be declared first
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm); // then use it
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, ] = useState("");
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    currency: "",
    numeric_code: "",
    phone_code: "",
    title: "",
    description: "",
  });
  // const handleSortChange = (key, order) => {
  //   setSortKey(key);
  //   setSortOrder(order);
  // };

  const [initialValuesSchema, setInitialValuesSchema] = useState({
    id: "",
    name: "",
    image: "",
    flag: "",
    banner: "",
    title: "",
    description: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    title: Yup.string(),
    description: Yup.string(),
    flag: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      })
      .test("fileFormat", "Unsupported Format.", (value) => {
        if (value && typeof value !== "string")
          return SUPPORTED_FORMATS_IMAGE.includes(value.type);
        return true;
      }),
    banner: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      })
      .test("fileFormat", "Unsupported Format.", (value) => {
        if (value && typeof value !== "string")
          return SUPPORTED_FORMATS_IMAGE.includes(value.type);
        return true;
      }),
    image: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      })
      .test("fileFormat", "Unsupported Format.", (value) => {
        if (value && typeof value !== "string")
          return SUPPORTED_FORMATS_IMAGE.includes(value.type);
        return true;
      }),
  });
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchCountries = async () => {
    try {
      const data = await AxiosHelper.getData("country", param);
      if (data?.status) {
        const { record = [], count = 0 } = data.data;
        setCountries(record);
        setTotalItems(count);
      }
    } catch (error) {
      console.log("ERROR WHILE FETCHING COUNTRIES:", error);
      setCountries([]);
    }
  };
  const handleSortChange = (key,order) => {
    setSortKey(key);
    setSortOrder(order);
  };

  const editData = (event) => {
    const { _id, name, image, flag, banner, title, description } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      setInitialValuesSchema({
        id: _id,
        name,
        image,
        flag,
        banner,
        title,
        description,
      });
    }
    setEditShow(true);
  };

  const viewData = (event) => {
    const data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues(data);
    setShow(true);
  };

  const handleClick = async (id, status) => {
    try {
      const response = await AxiosHelper.getData(`updateStatus/roles/${id}`);
      if (response?.status) {
        toast.success(`Status updated to ${status ? "Active" : "Inactive"}`);
        fetchCountries();
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const dropList = [
    {
      name: "View",
      module_id: "Country",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Edit",
      module_id: "Country",
      onClick: editData,
      className: "w-full block bg-white text-slate-400",
    },
  ];
  const fields = [
    {
      label: "Country Name",
      name: "name",
      type: "text",
      col: 6,
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      col: 6,
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
      label: "Flag",
      name: "flag",
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
      label: "Name",
      sortable: true,
      render: (row) => <div className="text-sm text-gray-900">{row.name}</div>,
    },
    {
      key: "currency",
      label: "Currency",
      sortable: true,
      render: (row) => (
        <div className="text-sm text-gray-900">{row.currency}</div>
      ),
    },
    {
      key: "numeric_code",
      label: "ISO Code",
      sortable: true,
      render: (row) => (
        <div className="text-sm text-gray-900">{row.numeric_code}</div>
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
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]); 

  useEffect(() => {
    fetchCountries();
  }, [debouncedSearch, currentPage, itemsPerPage, sortKey, sortOrder, statusFilter,param]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-3xl font-bold text-gray-900">Country</h4>
          <Link
            to="/admin"
            className="px-4 py-2 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white"
          >
            Dashboard
          </Link>
        </div>

        <DataTable
          tabletName="Countries List"
          data={Array.isArray(countries) ? countries : []}
          columns={columns}
          searchable={true}
          selectable={true}
          action={(item) => (
            <Action         
              dropList={dropList}
              data={item}
              onEdit={editData}
              onView={viewData}       
            />
          )}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortKey={sortKey}
          sortOrder={sortOrder}
          // onSortChange={handleSortChange}
          onSortChange={handleSortChange}
         
        />
      </div>

      {/* view data modal  | Start */}
      <Modal
        size="lg"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Country Details
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
              <label className="fs-6 m-0 font-bold">Currency</label>
              <span className="fs-6">{initialValues?.currency}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Numeric Code</label>
              <span className="fs-6">{initialValues?.numeric_code}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 m-0 font-bold">Phone Code</label>
              <span className="fs-6">{initialValues?.phone_code}</span>
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

      {/* Edit Modal */}
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
            Edit Country Details
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
                    `country/${initialValuesSchema.id}`,
                    formData,
                    true
                  );
                  if (data?.status) {
                    toast.success("Updated Country data successfully!");
                    setEditShow(false);
                    fetchCountries();
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
      {/* edit Form Data | End */}
    </div>
  );
};

export default Country;
