import React, { useState, useCallback, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import permission_module from "../../data/permission_module";
import AxiosHelper from "../../helper/AxiosHelper";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { updatePermission } from "../../redux/admin/adminSlice";

const Permission = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permissions, setPermissions] = useState(permission_module);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRolePermission = useCallback(async () => {
    try {
      setLoading(true);
      const roleData = await AxiosHelper.getData(`get-role/${id}`);
      //   console.log("roleData: ", roleData);
      if (roleData?.status === true) {
        const { data } = await AxiosHelper.getData(`role_permission/${id}`);
        if (data?.status === true) {
          let permissionData = data?.data;
          const rolePermissions = permissions.map((module) => {
            return {
              ...module,
              all: permissionData[module.module]?.all || false,
              view: permissionData[module.module]?.can_view || false,
              add: permissionData[module.module]?.can_add || false,
              delete: permissionData[module.module]?.can_delete || false,
              edit: permissionData[module.module]?.can_edit || false,
              export: permissionData[module.module]?.can_export || false,
              import: permissionData[module.module]?.can_import || false,
            };
          });
          setPermissions(rolePermissions);
          dispatch(updatePermission(rolePermissions));
        }
      } else {
        navigate("/admin/role");
      }
    } catch (error) {
      setError(error.message);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  }, [id]);

  useEffect(() => {
    getRolePermission();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>; // Optionally show an error message if something goes wrong
  }

  // Function to handle permission checkbox changes
  const onPermissionChange = async (module, field) => {
    const updatedPermissions = permissions.map((permission) => {
      if (permission.module === module) {
        // Handle "All" checkbox logic
        if (field === "all") {
          const newValue = !permission.all;
          return {
            ...permission,
            all: newValue,
            view: newValue,
            add: newValue,
            edit: newValue,
            delete: newValue,
            import: newValue,
            export: newValue,
          };
        }
        // Handle view | if a user can't view then can not perform any action

        if (field === "view") {
          const newValue = !permission.view;
          if (newValue === false) {
            return {
              ...permission,
              all: false,
              view: false,
              add: false,
              edit: false,
              delete: false,
              import: false,
              export: false,
            };
          }
        }

        // Handle individual checkbox logic
        const updatedPermission = {
          ...permission,
          [field]: !permission[field],
        };
        const allChecked =
          updatedPermission.view &&
          updatedPermission.add &&
          updatedPermission.edit &&
          updatedPermission.import &&
          updatedPermission.export &&
          updatedPermission.delete;
        return { ...updatedPermission, all: allChecked };
      }
      return permission;
    });

    setPermissions(updatedPermissions);
    const updatedModule = updatedPermissions.find(
      (perm) => perm.module === module
    );

    try {
      // Make API call to update permissions
      const response = await AxiosHelper.postData(
        `update_role_permission/${id}`,
        {
          module,
          permissions: {
            all: updatedModule.all,
            can_view: updatedModule.view,
            can_add: updatedModule.add,
            can_edit: updatedModule.edit,
            can_delete: updatedModule.delete,
            can_export: updatedModule.export,
            can_import: updatedModule.import,
          },
        }
      );

      if (response?.status) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="row mx-3 ">
        <div className="col-md-12 ">
          <div className="card mb-3">
            <div className="card-header bg-white">
              <div className="row flex items-center ">
                <div className="col-auto align-self-center">
                  <h5 className="mb-0" data-anchor="data-anchor">
                    Manage Permission | Role List
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <div className="mt-2" role="tablist">
                    <Link
                      to={`/admin`}
                      className="me-2 btn btn-sm btn-falcon-default text-slate-700"
                    >
                      <i className="fa fa-home me-1"></i>
                      <span className="d-none d-sm-inline-block ms-1">
                        Dashboard
                      </span>
                    </Link>
                    <button className="btn-theme text-sm text-white rounded px-2 py-1">
                      <Link to={`/admin/role`}>Go back</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0 m-0">
              <div className="tab-content">
                <div id="tableExample2" data-list="">
                  <div className="table-responsive">
                    <table className="table items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Module
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            All
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            View
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Add
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Edit
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Delete
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Export
                          </th>
                          <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                            Import
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissions.map((permission, index) => (
                          <tr key={index}>
                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                              <span className="mb-0 leading-normal text-sm uppercase">
                                {permission.module}
                              </span>
                            </td>
                            <td>
                              <div className="form-check form-switch min-h-6 mb-0.5 flex items-center">
                                <input
                                  className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                  type="checkbox"
                                  checked={permission.all}
                                  onChange={() =>
                                    onPermissionChange(permission.module, "all")
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch min-h-6 mb-0.5 flex items-center">
                                <input
                                  className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                  type="checkbox"
                                  checked={permission.view}
                                  onChange={() =>
                                    onPermissionChange(
                                      permission.module,
                                      "view"
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch min-h-6 mb-0.5 flex items-center">
                                <input
                                  className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                  type="checkbox"
                                  checked={permission.add}
                                  onChange={() =>
                                    onPermissionChange(permission.module, "add")
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch min-h-6 mb-0.5 flex items-center">
                                <input
                                  className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                  type="checkbox"
                                  checked={permission.edit}
                                  onChange={() =>
                                    onPermissionChange(
                                      permission.module,
                                      "edit"
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch min-h-6 mb-0.5 flex items-center">
                                <input
                                  className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                  type="checkbox"
                                  checked={permission.delete}
                                  onChange={() =>
                                    onPermissionChange(
                                      permission.module,
                                      "delete"
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div
                                className={
                                  permission.module === "Cms_page" ||
                                  permission.module === "Banner"
                                    ? "flex items-center justify-center cursor-not-allowed"
                                    : "form-check form-switch min-h-6 mb-0.5 flex items-center"
                                }
                              >
                                {permission.module === "Cms_page" ||
                                permission.module === "Banner" ? (
                                  <span className="mb-0 leading-normal text-sm uppercase text-slate-400">
                                    N/A
                                  </span>
                                ) : (
                                  <input
                                    className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                    type="checkbox"
                                    checked={permission.export}
                                    onChange={() =>
                                      onPermissionChange(
                                        permission.module,
                                        "export"
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </td>
                            <td>
                              <div
                                className={
                                  permission.module === "Cms_page" ||
                                  permission.module === "Banner"
                                    ? "flex items-center justify-center cursor-not-allowed"
                                    : "form-check form-switch min-h-6 mb-0.5 flex items-center"
                                }
                              >
                                {permission.module === "Cms_page" ||
                                permission.module === "Banner" ? (
                                  <span className="mb-0 leading-normal text-sm uppercase text-slate-400">
                                    N/A
                                  </span>
                                ) : (
                                  <input
                                    className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
                                    type="checkbox"
                                    checked={permission.import}
                                    onChange={() =>
                                      onPermissionChange(
                                        permission.module,
                                        "import"
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permission;

// <div
//   className={
//     permission.module === "Cms_page"
//       ? "flex items-center justify-center cursor-not-allowed"
//       : "form-check form-switch min-h-6 mb-0.5 flex items-center"
//   }
// >
//   {permission.module === "Cms_page" ? (
//     <span className="mb-0 leading-normal text-sm uppercase text-slate-400">
//       N/A
//     </span>
//   ) : (
//     <input
//       className="form-check-input rounded-10 duration-300 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-300 checked:after:end-1 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-blue-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right"
//       type="checkbox"
//       checked={permission.add}
//       onChange={() =>
//         onPermissionChange(
//           permission.module,
//           "add"
//         )
//       }
//     />
//   )}
// </div>
