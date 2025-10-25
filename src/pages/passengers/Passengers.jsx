// import React, { useEffect, useState } from "react";
// import { getDeleteConfig } from "../../helper/stringHelper";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import AxiosHelper from "../../helper/AxiosHelper";
// import Action from "../../components/Table/Action";
// import { Modal, CloseButton } from "react-bootstrap";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { DataTable } from "../../components/DataTable/DataTable";
// import { StatusBadge } from "../../components/DataTable/StatusBadge";

// const AlertMessage = withReactContent(Swal);

// const Passengers = () => {
//   const [show, setShow] = useState(false);
//   const [initialValues, setInitialValues] = useState({});
//   const [passengers, setPassengers] = useState();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
//   const [totalItems, setTotalItems] = useState(0);
//   const [sortKey, setSortKey] = useState("name"); // default sort
//   const [sortOrder, setSortOrder] = useState("desc"); // -1 for descending, 1 for ascending
//   const [statusFilter] = useState("");
//   const [param, setParam] = useState({
//     limit: 1,
//     pageNo: 1,
//     query: "",
//     orderBy: "createdAt",
//     orderDirection: -1,
//   });

//   // =============List of all drivers==============
//   const fetchingPassengers = async () => {
//     try {
//       const data = await AxiosHelper.getData("passengers", {
//         pageNo: currentPage,
//         limit: itemsPerPage,
//         query: debouncedSearch,
//         orderBy: sortKey,
//         orderDirection: sortOrder,
//         status: statusFilter,
//       });

//       if (data?.status) {
//         setPassengers(data.data.record);
//         setTotalItems(data.data.count);
//       }
//     } catch (error) {
//       console.log("Error while fetching passengers data: ", error);
//     }
//   };
//   // ============View Data=============

//   const viewData = async (event) => {
//     var data = JSON.parse(
//       event.currentTarget.attributes.getNamedItem("main-data").value
//     );
//     setInitialValues({
//       name: data?.name,
//       email: data?.email,
//       phone: data?.phone,
//     });
//     setShow(true);
//   };
//   // =============Delete Data===============
//   const deleteUser = async (event) => {
//     var { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
//     console.log(isConfirmed);
//     if (isConfirmed) {
//       const { _id } = await JSON.parse(
//         event.target.attributes.getNamedItem("main-data").value
//       );
//       if (_id) {
//         const data = await AxiosHelper.deleteData(`user/${_id}`);
//         if (data?.status) {
//           fetchingPassengers();
//           toast.success(data?.message);
//         } else {
//           toast.error(data?.message);
//         }
//       }
//     }
//   };

//   // ========Actions===========
//   const dropList = [
//     {
//       name: "View",
//       module_id: "User",
//       onClick: viewData,
//       className: "w-full block bg-white text-slate-400",
//     },
//     {
//       name: "Delete",
//       module_id: "User",
//       action: "delete",
//       onClick: deleteUser,
//       className: "w-full block bg-white text-danger",
//     },
//   ];

//   const columns = [
//     {
//       key: "name",
//       label: "Passenger Name",
//       sortable: true,
//       render: (passengers) => (
//         <div className="flex items-center">
//           <div className="text-sm font-medium text-gray-900">{passengers?.name}</div>
//         </div>
//       ),
//     },
//     {
//       key: "email",
//       label: "Email",
//       sortable: true,
//       render: (passengers) => (
//         <div className="flex items-center">
//           <div className="text-sm font-medium text-gray-900">{passengers?.email}</div>
//         </div>
//       ),

//     },
//     {
//       key: "Phone",
//       label: "phone",
//       sortable: true,
//       render: (passengers) => (
//         <div className="flex items-center">
//           <div className="text-sm font-medium text-gray-900">{passengers?.phone}</div>
//         </div>
//       ),
//     },
//   ];

//   const handleSortChange = (key, order) => {
//     setSortKey(key);
//     setSortOrder(order);
//   };

//     // ===== Handle Page Change =====
//   // const handlePageChange = (pageNo) => {
//   //   setParam({ ...param, pageNo });
//   // };
//   const updateParams = (page) => {
//     setParam({...param, pageNo:page})
//   };

//     useEffect(() => {
//       const delay = setTimeout(() => {
//         setParam({...param, query:searchTerm})
//         setDebouncedSearch(searchTerm);
//       }, 500); // wait 500ms after typing stops

//       return () => clearTimeout(delay);
//     }, [searchTerm]);

//   useEffect(() => {
//     fetchingPassengers();
//   }, [param]);

//   return (
//     <div className="min-h-screen bg-gray-100 ">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//         <div className="flex items-center justify-between mb-2">
//           <h4 className="text-3xl font-bold text-gray-900">
//             Passengers Management
//           </h4>
//           </div>
//           <DataTable
//             tabletName={"Passengers List"}
//             data={passengers}
//             columns={columns}
//             searchable={true}
//             selectable={true}
//             action={(item) => (
//               <Action
//                 dropList={dropList}
//                 data={item}
//                 onView={viewData}
//                 onDelete={deleteUser}
//               />
//             )}
//             currentPage={param?.pageNo}
//             itemsPerPage={param?.limit}
//             totalItems={totalItems}
//             onPageChange={updateParams}
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             // sortKey={sortKey}
//             // sortOrder={sortOrder}
//             onSortChange={handleSortChange}
//             // currentPage={currentPage}
//             // itemsPerPage={itemsPerPage}
//             // totalItems={totalItems}
//             // onPageChange={setCurrentPage}
//             // searchTerm={searchTerm}
//             // onSearchChange={setSearchTerm}
//             // sortKey={sortKey}
//             // sortOrder={sortOrder}
//             // onSortChange={handleSortChange}
//           />
//        </div>
//       {/* view data modal  | Start */}
//       <Modal
//         size="md"
//         show={show}
//         centered={true}
//         onHide={() => setShow(false)}
//         aria-labelledby="example-modal-sizes-title-lg"
//       >
//         <Modal.Header>
//           <Modal.Title id="example-modal-sizes-title-lg">
//             View Passenger Details
//           </Modal.Title>
//           <CloseButton
//             onClick={() => setShow(false)}
//             className=" text-red-500 flex items-center justify-center"
//           >
//             <i className="fa fa-close"></i>
//           </CloseButton>
//         </Modal.Header>
//         <Modal.Body>
//           <ul className="list-group">
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <label className="fs-6 font-bold m-0">Name</label>
//               <span className="fs-6">{initialValues?.name}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <label className="fs-6 font-bold m-0">Email</label>
//               <span className="fs-6">{initialValues?.email}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <label className="fs-6 font-bold m-0">Phone</label>
//               <span className="fs-6">{initialValues?.phone}</span>
//             </li>
//           </ul>
//         </Modal.Body>
//       </Modal>
//       {/* view data modal | end */}
//     </div>
//   );
// };

// export default Passengers;
import React, { useEffect, useState } from "react";
import { getDeleteConfig } from "../../helper/stringHelper";
import { toast } from "react-toastify";
import { Modal, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AxiosHelper from "../../helper/AxiosHelper";
import Action from "../../components/Table/Action";
import { DataTable } from "../../components/DataTable/DataTable";

const AlertMessage = withReactContent(Swal);

const Passengers = () => {
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [passengers, setPassengers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
  });

  const fetchingPassengers = async () => {
    try {
      const data = await AxiosHelper.getData("passengers", {
        ...param,
        query: debouncedSearch,
      });

      if (data?.status) {
        setPassengers(data.data.record);
        setTotalItems(data.data.count);
      }
    } catch (error) {
      console.error("Error while fetching passengers:", error);
    }
  };

  const viewData = (event) => {
    const data = JSON.parse(event.currentTarget.getAttribute("main-data"));
    setInitialValues({
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      image: data?.image,
    });
    setShow(true);
  };

  const deleteUser = async (event) => {
    const { isConfirmed } = await AlertMessage.fire(getDeleteConfig({}));
    if (isConfirmed) {
      const { _id } = JSON.parse(event.target.getAttribute("main-data"));
      if (_id) {
        const data = await AxiosHelper.deleteData(`user/${_id}`);
        if (data?.status) {
          fetchingPassengers();
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    }
  };

  const dropList = [
    {
      name: "View",
      module_id: "User",
      onClick: viewData,
      className: "w-full block bg-white text-slate-400",
    },
    {
      name: "Delete",
      module_id: "User",
      action: "delete",
      onClick: deleteUser,
      className: "w-full block bg-white text-danger",
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Profile img",
      sortable: true,
      render: (role) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            <img src={role?.image} className="w-16 h-16" alt="" />
          </div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Passenger Name",
      sortable: true,
      render: (passenger) => (
        <div className="text-sm font-medium text-gray-900">
          {passenger?.name}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (passenger) => (
        <div className="text-sm font-medium text-gray-900">
          {passenger?.email}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (passenger) => (
        <div className="text-sm font-medium text-gray-900">
          {passenger?.phone}
        </div>
      ),
    },
  ];

  const handleSortChange = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
    setParam({ ...param, orderBy: key, orderDirection: order });
  };

  const handlePageChange = (pageNo) => {
    setParam({ ...param, pageNo });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setParam((prev) => ({ ...prev, query: searchTerm, pageNo: 1 }));
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    fetchingPassengers();
  }, [param]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-3xl font-bold text-gray-900">
            Passengers Management
          </h4>
        </div>
        <DataTable
          tabletName="Passengers List"
          data={passengers}
          columns={columns}
          searchable={true}
          selectable={true}
          action={(item) => (
            <Action
              dropList={dropList}
              data={item}
              onView={viewData}
              onDelete={deleteUser}
            />
          )}
          currentPage={param.pageNo}
          itemsPerPage={param.limit}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <Modal
        size="md"
        show={show}
        centered={true}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Passenger Details
          </Modal.Title>
          <CloseButton
            onClick={() => setShow(false)}
            className="text-red-500 flex items-center justify-center"
          >
            <i className="fa fa-close"></i>
          </CloseButton>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Name</label>
              <span className="fs-6">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Email</label>
              <span className="fs-6">{initialValues?.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Phone</label>
              <span className="fs-6">{initialValues?.phone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs-6 font-bold m-0">Image</label>
              {initialValues?.image ? (
                <img
                  src={initialValues.image}
                  alt="Uploaded"
                  className="img-thumbnail"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              ) : (
                <span className="fs-6 text-muted">No Image</span>
              )}
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Passengers;
