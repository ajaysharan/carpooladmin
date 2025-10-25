import React, { useEffect, useState } from "react";
import AxiosHelper from "../../helper/AxiosHelper";
import { Link } from "react-router-dom";
import { Modal, CloseButton } from "react-bootstrap";
import Action from "../../components/Table/Action";
import MyForm from "../../components/Common/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constants/fromConfig";
import { FlagFallBack } from "../../assets/img/index";

const Country = () => {
  const [errors, setErrors] = useState();
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [countries, setCountries] = useState([]);
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

  // Fetching countries
  const fetchCountries = async () => {
    try {
      const data = await AxiosHelper.getData("country", param);
      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setCountries({ count, totalPages, record, pagination });
      }
    } catch (error) {
      console.log("ERROR WHILE FETCHING COUNTRIES: ", error);
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

  // ============ Edit Data ==========
  const editData = async (event) => {
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

  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      name: data?.name,
      image: data?.image,
      currency: data?.currency,
      numeric_code: data?.numeric_code,
      phone_code: data?.phone_code,
      title: data?.title,
      description: data?.description,
    });
    setShow(true);
  };

  // ======Handle Status update=======
  const handleStatus = async (id, status) => {
    try {
      const data = await AxiosHelper.putData(
        `toggle-status/country/${id}`,
        { status },
        false
      );
      if (data?.status === true) {
        toast.success("Status updated successfully!");
        fetchCountries();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.log("ERROR OCCURRED WHILE UPDATING DATA: ", error);
    }
  };

  //   ===== Handle Page Change =====

  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };
  // ========Actions===========
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
      action: "edit",
      onClick: editData,
      className: "w-full block bg-white text-slate-400",
    },
  ];

  const fields = [
    {
      label: "Country Name",
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
      className:
        "btn-theme text-sm text-white rounded px-2 py-1 my-4",
    },
  ];

  useEffect(() => {
    fetchCountries();
  }, [param]);

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Countries </h6>
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
                    <th className="px-3 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Image
                    </th>
                    <th
                      className="px-3 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="name"
                      onClick={handelSort}
                    >
                      <span>Name</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th
                      className="px-1 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="numeric_code"
                      onClick={handelSort}
                    >
                      <span>Numeric Code</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th
                      className="px-3 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="currency"
                      onClick={handelSort}
                    >
                      <span>Currency</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th
                      className="px-3 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="iso3"
                      onClick={handelSort}
                    >
                      <span>ISO Code</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th className="px-3 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Status
                    </th>
                    <th className="px-3 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {countries?.record?.map((country, index) => (
                    <tr key={index}>
                      <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                        <div className="object-contain w-[100px] aspect-square rounded flex items-center">
                          <img
                            src={country.image}
                            alt={country.name}
                            className="w-[100%] h-[100%]"
                            onError={(e) => (e.target.src = FlagFallBack)}
                          />
                        </div>
                      </td>
                      <td
                        className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer"
                        main-data={JSON.stringify(country)}
                        onClick={viewData}
                      >
                        <h6 className="mb-0 leading-normal text-sm capitalize text-primary">
                          {country?.name}
                        </h6>
                      </td>
                      <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                        <h6 className="mb-0 leading-normal text-sm capitalize">
                          {country?.numeric_code}
                        </h6>
                      </td>
                      <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                        <h6 className="mb-0 leading-normal text-sm uppercase">
                          {country?.currency}
                        </h6>
                      </td>
                      <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                        <h6 className="mb-0 leading-normal text-sm uppercase">
                          {country?.iso3}
                        </h6>
                      </td>
                      <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                        <span
                          className={`text-xs rounded-full px-2 py-1 cursor-pointer font-semibold ${
                            country?.status === 1
                              ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                              : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline capitalize leading-none text-white"
                          }`}
                          onClick={() => {
                            let status = country?.status === 1 ? 2 : 1;
                            handleStatus(country._id, status);
                          }}
                        >
                          {country?.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className=" align-middle bg-transparent border-b whitespace-nowrap">
                        <Action dropList={dropList} data={country} />
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
                    {param.pageNo * param.limit > countries?.count
                      ? countries?.count
                      : param.pageNo * param.limit}{" "}
                    of {countries?.count}
                  </span>
                </p>
              </div>
              <div className="w-auto flex items-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    dd="disabled"
                    className=" btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(countries?.pagination[0])}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {countries?.pagination?.map((row) => {
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
                        countries?.pagination[countries?.pagination.length - 1]
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
