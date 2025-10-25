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
 
       <div className="min-h-screen bg-gray-100 ">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                 <div className="flex items-center justify-between mb-2">
                     <h4 className="text-3xl font-bold text-gray-900">CMS Management</h4>
                     <Link
                       to="/admin/cms_page"
                       className="items-center px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white transition-colors duration-200"
                     >
                       <b>  Go Back</b>
                     </Link>
                 </div>
                 <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                   <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                     <div className="flex justify-between items-center">
                       <h3 className="text-lg font-semibold text-gray-900">Create CMS Page</h3>
                       <div className="w-80">
                         
                       </div>
                     </div>
                   </div>
              {/* form */}
              <div className="p-6 ">
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
    
  );
};

export default AddCmsPage;
