// import React, { useEffect, useState } from "react";
// import { Modal, CloseButton, Button, Form } from "react-bootstrap";
// import Swal from "sweetalert2"; 
// import { toast } from "react-toastify";
// import AxiosHelper from "../../helper/AxiosHelper";
// import Action from "../../components/Table/Action";
// import { Link } from "react-router-dom";
// // const AlertMessage = withReactContent(Swal);

// const GeneralSetting = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [viewModal, setViewModal] = useState(false);
//   const [generalSetting, setGeneralSetting] = useState([]);
//   const [param, setParam] = useState({
//     limit: 10,
//     pageNo: 1,
//     query: "",
//     orderBy: "createdAt",
//     orderDirection: -1,
//   });
//   const [settings, setSettings] = useState([]);
//   const [initialValues, setInitialValues] = useState({});
//   const [editMode, setEditMode] = useState(false);
      
//   const fetchSettings = async () => {
//     try {
//       const data = await AxiosHelper.getData("get-setting", param);
//       if (data?.status) {
//         let { count, totalPages, record, pagination } = data.data;

//         // Ensure pagination is an array
//         if (!Array.isArray(pagination)) {
//           pagination = Array.from({ length: totalPages }, (_, i) => i + 1);
//         }

//         setGeneralSetting({ count, totalPages, record, pagination });
//         setSettings(data.data);
//       }
//     } catch (err) {
//       toast.error("Error fetching settings");
//     }
//   };
//   const handleView = (event) => {
//     const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
//     setInitialValues(data);
//     setViewModal(true);
//   };
//   const handleEdit = (event) => {
//     const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
//     setInitialValues(data);
//     setEditMode(true);
//     setShowModal(true);
//   };
//   const handleDelete = async (event) => {
//     const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
  
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!"
//     });
  
//     if (result.isConfirmed) {
//       const res = await AxiosHelper.deleteData(`delete-setting/${data._id}`);
//       if (res?.status) {
//         await Swal.fire({
//           title: "Deleted!",
//           text: "The setting has been deleted.",
//           icon: "success"
//         });
//         toast.success(res.message);
//         fetchSettings();
//       } else {
//         toast.error("Delete failed");
//       }
//     }
//   };
  
//   const handleSubmit = async () => {
//     try {
//       const apiCall = editMode
//         ? AxiosHelper.putData(
//             `update-setting/${initialValues._id}`,
//             initialValues
//           )
//         : AxiosHelper.postData("create-setting", initialValues);

//       const res = await apiCall;
//       if (res?.status) {
//         toast.success(res.message);
//         fetchSettings();
//         setShowModal(false);
//       } else {
//         toast.error(res.message || "Operation failed");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//   };

//   const dropList = [
//     {
//       name: "View",
//       onClick: handleView,
//       className: "w-full block bg-white text-slate-400",
//     },
//     {
//       name: "Edit",
//       onClick: handleEdit,
//       className: "w-full block bg-white text-blue-500",
//     },
//     {
//       name: "Delete",
//       onClick: handleDelete,
//       className: "w-full block bg-white text-danger",
//     },
//   ];

//   const handlePageChange = (pageNo) => {
//     setParam({ ...param, pageNo });
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, [param]);

//   return (
//     <div className="flex flex-wrap -mx-3">
//       <div className="w-full px-3">
//         <div className="bg-white shadow-soft-xl rounded-2xl p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h6>Manage General Settings</h6>
//             <div className="text-[14px] gap-3 my-2 p-2 flex items-center justify-end">
//               <Link to={`/`} className="me-2 text-slate-700">
//                 <i className="fa fa-home me-1"></i>
//                 <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
//               </Link>
//               <Button
//                 onClick={() => {
//                   setEditMode(false);
//                   setInitialValues({ is_require: false });
//                   setShowModal(true);
//                 }}
//                 variant="success"
//                 className="bg-primary"
//                 size="sm"
//               >
//                 Add Setting
//               </Button>
//             </div>
//           </div>

//           <div className="my-2 p-2 flex items-center justify-between">
//             <div className="w-1/2 flex items-center gap-2">
//               <select
//                 className="w-auto form-select form-select-sm cursor-pointer"
//                 onChange={(e) => setParam({ ...param, limit: e.target.value })}
//               >
//                 {[10, 20, 50].map((row) => (
//                   <option key={row} value={row}>
//                     {row}
//                   </option>
//                 ))}
//               </select>
//               <span className="ps-1">Entries</span>
//             </div>
//             <div className="w-1/2 flex items-center">
//               <input
//                 placeholder="Search..."
//                 onChange={(e) =>
//                   setParam({ ...param, query: e.target.value, pageNo: 1 })
//                 }
//                 type="search"
//                 className="shadow-none form-control form-control-sm"
//               />
//             </div>
//           </div>

//           <table className="table table-hover">
//             <thead>
//               <tr>
//                 <th>Setting Name</th>
//                 <th>Field Label</th>
//                 <th>Field Name</th>
//                 <th>Field Value</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {settings?.record?.length > 0 ? (
//                 settings.record.map((row, idx) => (
//                   <tr key={idx}>
//                     <td>{row.setting_name}</td>
//                     <td>{row.field_label}</td>
//                     <td>{row.field_name}</td>
//                     <td>{row.field_value}</td>
//                     <td>
//                       <Action dropList={dropList} data={row} />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <div className="mt-3 flex items-center justify-between py-1 px-2">
//             <div>
//               <p className="mb-0 text-sm">
//                 {(param.pageNo - 1) * param.limit + 1} to{" "}
//                 {Math.min(
//                   param.pageNo * param.limit,
//                   generalSetting?.count || 0
//                 )}{" "}
//                 of {generalSetting?.count || 0}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <button
//                 type="button"
//                 className="btn btn-falcon-default btn-sm"
//                 onClick={() => handlePageChange(1)}
//               >
//                 <span className="fas fa-chevron-left" />
//               </button>

//               <ul className="pagination mb-0 mx-1">
//                 {(Array.isArray(generalSetting?.pagination)
//                   ? generalSetting.pagination
//                   : []
//                 ).map((row) => (
//                   <li key={row}>
//                     <button
//                       onClick={() => handlePageChange(row)}
//                       type="button"
//                       className={`page me-1 btn btn-sm ${
//                         row === param?.pageNo
//                           ? "border border-blue-500 shadow-lg rounded"
//                           : "border border-slate-700 shadow-lg rounded"
//                       }`}
//                     >
//                       {row}
//                     </button>
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 type="button"
//                 className="btn btn-falcon-default btn-sm"
//                 onClick={() =>
//                   handlePageChange(
//                     generalSetting?.pagination?.[
//                       generalSetting.pagination.length - 1
//                     ] || 1
//                   )
//                 }
//               >
//                 <span className="fas fa-chevron-right" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       <Modal show={viewModal} onHide={() => setViewModal(false)} centered>
//         <Modal.Header>
//           <Modal.Title>View Setting</Modal.Title>
//           <CloseButton
//             className="bg-amber-400 hover:bg-red-700 text-2xl text-black"
//             onClick={() => setViewModal(false)}
//           />
//         </Modal.Header>
//         <Modal.Body>
//           <ul className="list-group">
//             <li className="list-group-item">
//               Setting Name: {initialValues.setting_name}
//             </li>
//             <li className="list-group-item">
//               Field Label: {initialValues.field_label}
//             </li>
//             <li className="list-group-item">
//               Field Name: {initialValues.field_name}
//             </li>
//             <li className="list-group-item">
//               Field Value: {initialValues.field_value}
//             </li>
//           </ul>
//         </Modal.Body>
//       </Modal>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header>
//           <Modal.Title>{editMode ? "Edit" : "Add"} Setting</Modal.Title>
//           <CloseButton onClick={() => setShowModal(false)} />
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-2">
//               <Form.Label>Setting Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={initialValues.setting_name || ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     setting_name: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Field Label</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={initialValues.field_label || ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     field_label: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Field Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={initialValues.field_name || ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     field_name: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Field Value</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 value={initialValues.field_value || ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     field_value: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Field Type</Form.Label>
//               <Form.Select
//                 value={initialValues.field_type || ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     field_type: e.target.value,
//                   })
//                 }
//               >
//                 <option value="">Select Type</option>
//                 <option value="text">Text</option>
//                 <option value="email">Email</option>
//                 <option value="number">Number</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Is Required</Form.Label>
//               <Form.Select
//                 value={initialValues.is_require ?? ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     is_require: e.target.value === "true",
//                   })
//                 }
//               >
//                 <option value="">Select</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Setting Type</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={initialValues.setting_type ?? ""}
//                 onChange={(e) =>
//                   setInitialValues({
//                     ...initialValues,
//                     setting_type: Number(e.target.value),
//                   })
//                 }
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             className="bg-danger"
//             onClick={() => setShowModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             className="bg-primary"
//             onClick={handleSubmit}
//           >
//             {editMode ? "Update" : "Create"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default GeneralSetting;
