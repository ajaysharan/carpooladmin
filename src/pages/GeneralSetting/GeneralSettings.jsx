import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
// import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constant/fromConfig";
import MyForm from "../../components/Common/MyForm";

const GeneralSettings = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fields: [],
    initialValues: {},
    validFields: {},
  });

  useEffect(() => {
     (async () => {
      var data = await AxiosHelper.getData(`settings-list/${type}`);

      if (data?.status === true) {
        data = data?.data;
        var initialValues = {};
        var validFields = {};
        var fields = [];

        data?.forEach((element) => {
          if (element.field_type === "file") {
            initialValues[element.field_name] = element.field_value || "";
          } else if (element.field_type === "check") {
            initialValues[element.field_name] = parseInt(
              element.field_value || ""
            );
          } else if (element.field_type === "submit") {
            initialValues[element.field_name] = "submit";
          } else {
            initialValues[element.field_name] = element.field_value || "";
          }

          // ***********************************
          if (element.field_type !== "file") {
            validFields[element.field_name] = Yup.string()
              .min(1)
              .max(5000)
              .required();
          } else {
            validFields[element.field_name] = Yup.mixed().test(
              "fileSize",
              "File too large",
              (value) => {
                if (value && typeof value !== "string")
                  return value.size <= 500000;
                return true;
              }
            );
          }

          // ***********************************
          fields.push({
            label: element.field_label,
            name: element.field_name,
            type: element.field_type,
            col: 6,
          });
        });

        fields.push({
          label: "Update Setting",
          name: "submit",
          type: "submit",
          className: "btn-theme text-sm text-white rounded px-2 py-1 my-4",
        });

        setValues({ fields, initialValues, validFields });
      } else {
        navigate("admin");
        toast.error(data?.message);
      }
    })();
  }, [type]);

  return (   
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between mb-2 py-3">
          <h4 className="text-3xl font-bold text-gray-900">
            Application Settings
          </h4>
          <div className="col-auto ms-auto">
            <Link
              to={`/admin`}
              className="me-2 btn btn-falcon-default btn-sm"
            >
              <i className="fa fa-home me-1"></i>
              <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Application Settings</h3>
              
              </div>
            </div>
            </div>
       
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-2">
        <MyForm
          validSchema={Yup.object().shape(values.validFields)}
          fields={values.fields}
          initialValues={values.initialValues}
          onSubmit={async (newValues) => {
            const formData = new FormData();

            Object.keys(newValues).forEach((key) => {
              if (
                newValues[key] === "" ||
                newValues[key] === null ||
                newValues[key] === undefined
              )
                return;
              // Check for File object (like image)
              if (
                typeof newValues[key] === "object" &&
                newValues[key] instanceof File
              ) {
                
                formData.append(key, newValues[key]);
              } else {
                formData.append(key, newValues[key]);
              }
            });
            var  data  = await AxiosHelper.putData(`update-settings?type=${type}`,formData, true);       
            if (data?.status === true) {              
              toast.success(data?.message);             
            } else {
              toast.error(data?.message);
            }
          }}
        />
      </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
