import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { Modal, CloseButton } from "react-bootstrap";
import PermissionBlock from "../../components/PermissionBlock";
import { toast } from "react-toastify";
import { getDeleteConfig } from "../../helper/stringHelper";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AlertMessage = withReactContent(Swal);

const CmsPageList = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [pages, setPages] = useState();
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // =============List of all CMS_Pages==============
  const fetchingCMSPages = async () => {
    try {
      const data = await AxiosHelper.getData("cms-pages", param);
      if (data?.status) {
        let { count, totalPages, record, pagination } = data.data;
        setPages({ count, totalPages, record, pagination });
      }
    } catch (error) {
      console.log("Error while fetching drivers data: ", error);
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
  const edit = async (event) => {
    const { _id } = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    if (_id) {
      navigate(`/admin/cms_page/edit/${_id}`);
    }
  };

  // ============View Data=============

  const viewData = async (event) => {
    var data = JSON.parse(
      event.currentTarget.attributes.getNamedItem("main-data").value
    );
    setInitialValues({
      title: data?.title,
      content: data?.content,
      metaTitle: data?.seo?.metaTitle,
      metaDescription: data?.seo?.metaDescription,
      metaKeywords: data?.seo?.metaKeywords,
      thumbnail: data?.image,
    });
    setShow(true);
  };

  // ======Handle Status update=======
  const handleStatus = async (id, status) => {
    try {
      const data = await AxiosHelper.putData(
        `cms-page-update-status/${id}`,
        { status },
        false
      );
      console.log("Data: ", data);
      if (data?.status === true) {
        toast.success("Status updated successfully!");
        fetchingCMSPages();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.log("ERROR OCCURRED WHILE UPDATING DATA: ", error);
    }
  };

  // =============Delete Data===============
  const deleteCMSPage = async (event) => {
    var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    console.log(isConfirmed);
    if (isConfirmed) {
      const { _id } = await JSON.parse(
        event.target.attributes.getNamedItem("main-data").value
      );
      if (_id) {
        const data = await AxiosHelper.deleteData(`delete-cms-page/${_id}`);
        if (data?.status) {
          toast.success(data?.message);
          fetchingCMSPages();
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
      module_id: "Cms_page",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Edit",
      module_id: "Cms_page",
      action: "edit",
      onClick: edit,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "User",
      action: "delete",
      onClick: deleteCMSPage,
      className: "w-full block bg-white text-danger",
    },
  ];

  //   ===== Handle Page Change =====
  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };

  // ======Fetching Users=========
  useEffect(() => {
    fetchingCMSPages();
  }, [param]);

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Manage CMS Pages </h6>
            <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
              <Link to={`/`} className="me-2 text-slate-700">
                <i className="fa fa-home me-1"></i>
                <span className="d-none d-sm-inline-block ms-1 ">
                  Dashboard
                </span>
              </Link>
              <PermissionBlock module={"Cms_page"} action={"add"}>
                <button className="text-sm btn-theme text-white rounded px-2 py-1">
                  <Link to={`/admin/cms_page/create`}>Add CMS Pages</Link>
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
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Image
                    </th>
                    <th
                      className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70 cursor-pointer"
                      data-sort="name"
                      onClick={handelSort}
                    >
                      <span>Page</span>
                      <i className="fa fa-sort w-[8px] mx-3"></i>
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      title
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      status
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-[13px] text-slate-400 opacity-70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages?.record?.length > 0 &&
                    pages?.record?.map((page, index) => (
                      <tr key={index} className="align-middle">
                        <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <div className="w-[150px] max-h-[150px] overflow-hidden p-2 flex items-center justify-center">
                            <img
                              src={page.image}
                              alt={page.title}
                              className="w-[100px] h-[100px]"
                            />
                          </div>
                        </td>
                        <td
                          className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer"
                          main-data={JSON.stringify(page)}
                          onClick={viewData}
                        >
                          <h6 className="mb-0 leading-normal text-sm capitalize pl-4 text-primary">
                            {page?.page_id?.name}
                          </h6>
                        </td>
                        <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <h6 className="mb-0 leading-normal text-sm capitalize pl-4 ">
                            {page?.title}
                          </h6>
                        </td>
                        <td className="align-middle bg-transparent border-b whitespace-nowrap shadow-transparent cursor-pointer">
                          <h6 className="mb-0 leading-normal text-sm capitalize pl-4">
                            <span
                              className={`text-xs rounded-full px-2 py-1 font-semibold cursor-pointer ${
                                page?.status === 1
                                  ? "bg-gradient-to-tl from-green-600 to-lime-400 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                                  : "bg-gradient-to-tl from-slate-600 to-slate-300 px-3.6 text-xs rounded-1.8 py-2.2 inline-block whitespace-nowrap text-center align-baseline font-bold  leading-none text-white"
                              }`}
                              onClick={() => {
                                let status = page?.status === 1 ? 2 : 1;
                                handleStatus(page._id, status);
                              }}
                            >
                              {page?.status === 1 ? "Active" : "Inactive"}
                            </span>
                          </h6>
                        </td>
                        <td className=" align-middle bg-transparent border-b whitespace-nowrap">
                          <Action dropList={dropList} data={page} />
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
                    {param.pageNo * param.limit > pages?.count
                      ? pages?.count
                      : param.pageNo * param.limit}{" "}
                    of {pages?.count}
                  </span>
                </p>
              </div>
              <div className="w-auto flex items-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    dd="disabled"
                    className=" btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(pages?.pagination[0])}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {pages?.pagination?.map((row) => {
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
                        pages?.pagination[pages?.pagination.length - 1]
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
            View Page Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShow(false)}
            className=" text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full min-h-[200px] p-2 overflow-hidden flex items-center justify-center">
            <img
              src={initialValues.thumbnail}
              alt={initialValues.title}
              className="w-[200px] h-[200px]"
            />
          </div>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Title</label>
              <span className="fs-6">{initialValues?.title}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Content</label>
              <span
                className="fs-6 px-3 text-justify"
                dangerouslySetInnerHTML={{
                  __html: initialValues?.content
                    ? initialValues?.content
                    : "--",
                }}
              ></span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Meta Title</label>
              <span className="fs-6">{initialValues?.metaTitle}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Meta Description</label>
              <span
                className="fs-6 px-3 text-justify"
                dangerouslySetInnerHTML={{
                  __html: initialValues?.metaDescription
                    ? initialValues?.metaDescription
                    : "--",
                }}
              ></span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Meta Keywords</label>
              <span className="fs-6">
                {Array.isArray(initialValues?.metaKeywords)
                  ? initialValues?.metaKeywords
                      ?.map((keyword) => keyword)
                      .join(", ")
                  : initialValues?.metaKeywords}
              </span>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      {/* view data modal | end */}
    </div>
  );
};

export default CmsPageList;
