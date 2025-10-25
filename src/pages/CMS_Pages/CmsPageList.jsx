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
import { DataTable } from "../../components/DataTable/DataTable";
import {STATUS}  from "../../constants/fromConfig"

const AlertMessage = withReactContent(Swal);

const CmsPageList = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [pages, setPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("name"); // default sort
  const [sortOrder, setSortOrder] = useState("desc"); // -1 for descending, 1 for ascending
  const [statusFilter] = useState("");
  const [param, setParam] = useState({
    limit: 5,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  // =============List of all CMS_Pages==============
  const fetchingCMSPages = async () => {
    try {
      const data = await AxiosHelper.getData("cms-pages", param, {
        pageNo: currentPage,
        limit: itemsPerPage,
        query: debouncedSearch,
        orderBy: sortKey,
        orderDirection: sortOrder,
        status: statusFilter,
      });

      if (data?.status) {
        setPages(data.data.record);
        setTotalItems(data.data.count);
      }
      // const data = await AxiosHelper.getData("cms-pages", param);
      // if (data?.status) {
      //   let { count, totalPages, record, pagination } = data.data;
      //   setPages({ count, totalPages, record, pagination });
      // }
    } catch (error) {
      console.log("Error while fetching drivers data: ", error);
    }
  };

  // ========== SORTING ==========
  // const handelSort = (event) => {
  //   var orderBy =
  //     event.currentTarget.attributes.getNamedItem("data-sort").value;
  //   if (param?.orderBy !== orderBy) {
  //     setParam({ ...param, orderBy });
  //   } else {
  //     setParam({ ...param, orderDirection: param?.orderDirection * -1 });
  //   }
  // };

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
  const handleSortChange = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
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
  // const handlePageChange = (pageNo) => {
  //   setParam({ ...param, pageNo });
  // };
  const updateParams = (page) => {
    setParam({ ...param, pageNo: page });
  };

  // ======Fetching Users=========
  useEffect(() => {
    fetchingCMSPages();
  }, [param]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setParam({ ...param, query: searchTerm });
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delay);
  }, [searchTerm]);
  const columns = [
    {
      key: "image",
      label: "image",
      sortable: true,
      render: (page) => (
        <div className="w-[150px] max-h-[150px] overflow-hidden p-2 flex items-center justify-center">
          <img
            src={page.image}
            alt={page.title}
            className="w-[100px] h-[100px]"
          />
        </div>
      ),
    },
    {
      key: "page",
      label: "page",
      render: (page) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {page?.page_id?.name}
          </div>
        </div>
      ),
    },

    {
      key: "title",
      label: "title",

      render: (page) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {" "}
            {page?.title}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (page) => {
        const currentStatus = STATUS.find((s) => s.id === page?.status);
        const isActive = page?.status === 1;
    
        return (
          <span
            className={`text-xs rounded-full px-3 py-2 font-semibold cursor-pointer inline-block whitespace-nowrap text-center align-baseline leading-none text-white ${
              isActive
                ? "bg-gradient-to-tl from-green-600 to-lime-400"
                : "bg-gradient-to-tl from-slate-600 to-slate-300"
            }`}
            onClick={() => {
              const newStatus = isActive ? 2 : 1;
              handleStatus(page._id, newStatus);
            }}
          >
            {currentStatus?.name || "Unknown"}
          </span>
        );
      },
    }
    
  ];
  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-3xl font-bold text-gray-900">CMS Management</h4>
            <Link
              to="/admin/cms_page/create"
              className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
            >
              <b> Manage CMS Pages</b>
            </Link>
          </div>
          <DataTable
            tabletName={"CMS List"}
            data={pages}
            columns={columns}
            searchable={true}
            selectable={true}
            action={(item) => (
              <Action
                dropList={dropList}
                data={item}
                onEdit={edit}
                onView={viewData}
                onDelete={deleteCMSPage}
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
      {/* // view data modal | Start */}
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
    </>
  );
};

export default CmsPageList;
