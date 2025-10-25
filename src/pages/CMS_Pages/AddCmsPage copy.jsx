import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import MyForm from "../../components/Common/MyForm";
import { FILE_SIZE, FILE_SIZE_video, STATUS } from "../../constants/fromConfig";

const AddCmsPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ name: "", status: "" });
  const [pageList, setPageList] = useState([]); // State to hold page list
  const [selectedPageId, setSelectedPageId] = useState(""); // State for selected page ID

  const fetchPageList = useCallback(async () => {
    try {
      const pageResponse = await AxiosHelper.getData("page-list"); // Updated endpoint
      if (pageResponse?.status === true) {
        setPageList(pageResponse?.data); // Update page list state
      } else {
        toast.error(pageResponse?.data?.message); // Handle error
      }
    } catch (error) {
      toast.error("Error fetching page list");
      console.log("ERROR WHILE FETCHING PAGE LIST: ", error);
    }
  }, []);

  useEffect(() => {
    fetchPageList();
  }, [fetchPageList]);

  const initialValues = {
    title: "",
    content: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
    },
    page: "",
    status: "",
    image: "",
    video: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(500, "Title must be less than 500 characters"),
    image: Yup.mixed()
      .nullable()
      .required()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      }),
    video: Yup.mixed()
      .nullable()
      .notRequired()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string")
          return value.size <= FILE_SIZE_video;
        return true;
      }),
  });

  const fields = [
    {
      label: "Page",
      name: "page",
      type: "select2",
      options: pageList,
      col: 12,
      onChange: (e) => {
        const value = e ? e._id : ""; // Use _id instead of value
        setSelectedPageId(value); // Update selected page ID
      },
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      col: 12,
    },
    {
      label: "Content",
      name: "content",
      type: "text-editer",
      col: 12,
    },
    {
      label: "Meta Title",
      name: "seo.metaTitle",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Keyword",
      name: "seo.metaKeywords",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Description",
      name: "seo.metaDescription",
      type: "textarea",
      col: 12,
    },
    {
      label: "Status",
      name: "status",
      type: "select2",
      options: STATUS,
      col: 12,
    },
    {
      label: "Image",
      name: "image",
      type: "file",
      col: 6,
    },
    {
      label: "Video",
      name: "video",
      type: "file",
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
      className:
        "btn-theme text-white text-sm py-1 px-3 mt-3 rounded text-sm",
    },
  ];

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Add Page</h6>
          </div>
          <div className="flex-auto px-6 pt-0 pb-2">
            <div className="p-0 overflow-x-hidden">
              <div className="w-full min-h-[50px] text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
                <Link
                  to={`/`}
                  className="me-2 btn btn-sm btn-falcon-default text-slate-700"
                >
                  <i className="fa fa-home me-1"></i>
                  <span className="d-none d-sm-inline-block ms-1">
                    Dashboard
                  </span>
                </Link>
                <button className="btn-theme text-sm text-white rounded px-2 py-1">
                  <Link to={`/admin/cms_page`}>Go back</Link>
                </button>
              </div>
              {/* form */}
              <div className="flex flex-col gap-2 p-2 min-h-[50vh] relative">
                <MyForm
                  errors={errors}
                  fields={fields}
                  initialValues={initialValues}
                  validSchema={validationSchema}
                  onSubmit={async (values) => {
                    try {
                      const formData = new FormData();
                      Object.keys(values).forEach((key) => {
                        if (
                          values[key] === "" ||
                          values[key] === null ||
                          values[key] === undefined
                        )
                          return;
                        if (
                          typeof values[key] === "object" &&
                          !(values[key] instanceof File)
                        ) {
                          Object.keys(values[key]).forEach((innerKey) => {
                            formData.append(
                              `${key}[${innerKey}]`,
                              values[key][innerKey]
                            );
                          });
                        } else {
                          formData.append(key, values[key]);
                        }
                      });
                      // const dataVal = Object.fromEntries(formData.entries());
                      // console.log("FORM DATA: ", dataVal);
                      const data = await AxiosHelper.postData(
                        "create-cms-pages",
                        formData,
                        true
                      );

                      // console.log("DATA: ", data);
                      if (data?.status === true) {
                        toast.success(data?.data?.message);
                        navigate("/admin/cms_page");
                      } else {
                        toast.error(data?.data?.message);
                        setErrors(data?.data?.data);
                      }
                    } catch (error) {
                      if (typeof error === Yup.ValidationError) {
                        error.inner.map((e) => {
                          console.log(e);
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCmsPage;
