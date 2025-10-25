

// import React, { useEffect, useState } from "react";
// import AxiosHelper from "../helper/AxiosHelper";

// export default function Dashboard() {
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [newRide, setNewClients] = useState(0);
//   const [sales, setSales] = useState(103430); // Example hardcoded or fetched

//   useEffect(() => {
//     const fetchClientData = async () => {
//       try {
//         const res = await AxiosHelper.getData("/client");
//         setNewClients(res.data?.record?.length || 200);
//       } catch (err) {
//         console.error("Failed to fetch clients", err);
//       }
//     };

//     const fetchUserData = async () => {
//       try {
//         const res = await AxiosHelper.getData("/user");
//         setTotalUsers(res.data?.record?.length || 0);
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     };

//     fetchClientData();
//     fetchUserData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//         <div className="flex items-center justify-between mb-2">
//           <h4 className="text-3xl font-bold text-gray-900">Dashboard</h4>
//         </div>
//       </div>

//       <div className="flex flex-wrap mx-3">
//         {/* Card 1 - Today's Users */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 bg-white shadow-soft-xl rounded-2xl">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="w-2/3 px-3">
//                   <p className="mb-0 font-semibold text-sm">Total's Users</p>
//                   <h5 className="mb-0 font-bold">
//                     {totalUsers}
//                     <span className="text-sm font-bold text-lime-500 ml-2">+3%</span>
//                   </h5>
//                 </div>
//                 <div className="px-3 text-right w-1/3">
//                   <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-center">
//                     <i className="far fa-user text-white text-lg relative top-3.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 2 - New Clients */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 bg-white shadow-soft-xl rounded-2xl">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="w-2/3 px-3">
//                   <p className="mb-0 font-semibold text-sm">New Clients</p>
//                   <h5 className="mb-0 font-bold">
//                     {newClients}
//                     <span className="text-sm font-bold text-red-600 ml-2">-2%</span>
//                   </h5>
//                 </div>
//                 <div className="px-3 text-right w-1/3">
//                   <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-center">
//                     <i className="fa fa-scroll text-white text-lg relative top-3.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 3 - Sales */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 bg-white shadow-soft-xl rounded-2xl">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="w-2/3 px-3">
//                   <p className="mb-0 font-semibold text-sm">Sales</p>
//                   <h5 className="mb-0 font-bold whitespace-nowrap">
//                     ${sales.toLocaleString()}
//                     <span className="text-sm font-bold text-lime-500 ml-2">+5%</span>
//                   </h5>
//                 </div>
//                 <div className="px-3 text-right w-1/3">
//                   <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-center">
//                     <i className="far fa-shopping-cart text-white text-lg relative top-3.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 4 - Static Today's Money */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 bg-white shadow-soft-xl rounded-2xl">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="w-2/3 px-3">
//                   <p className="mb-0 font-semibold text-sm">Today's Money</p>
//                   <h5 className="mb-0 font-bold whitespace-nowrap">
//                     $53,000
//                     <span className="text-sm font-bold text-lime-500 ml-2">+55%</span>
//                   </h5>
//                 </div>
//                 <div className="px-3 text-right w-1/3">
//                   <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-center">
//                     <i className="far fa-money-bill text-white text-lg relative top-3.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import AxiosHelper from "../helper/AxiosHelper";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRide, setNewRide] = useState(0);
  const [sales, setSales] = useState(103430);

  const dummyChartData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 55 },
    { name: "May", value: 80 },
    { name: "Jun", value: 75 },
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const res = await AxiosHelper.getData("/get-rides");
        setNewRide(res.data?.record?.length || 200);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await AxiosHelper.getData("/user");
        setTotalUsers(res.data?.record?.length || 0);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchClientData();
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h4 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h4>

        <div className="flex flex-wrap -mx-3">
          <DashboardCard
            title="Total Users"
            value={totalUsers}
            percentage="+3%"
            iconClass="far fa-user"
            chartType="line"
            strokeColor="#22c55e"
            data={dummyChartData}
          />

          <DashboardCard
            title="Total Rides Active "
            value={newRide}
            percentage="-2%"
            percentageColor="text-red-600"
            iconClass="fa fa-scroll"
            chartType="bar"
            strokeColor="#6366f1"
            data={dummyChartData}
          />

          <DashboardCard
            title="Sales"
            value={`$${sales.toLocaleString()}`}
            percentage="+5%"
            iconClass="far fa-shopping-cart"
            chartType="line"
            strokeColor="#8b5cf6"
            data={dummyChartData}
          />

          <DashboardCard
            title="Today's Money"
            value="$53,000"
            percentage="+55%"
            iconClass="far fa-money-bill"
            chartType="area"
            strokeColor="#10b981"
            fillColor="#d1fae5"
            data={dummyChartData}
          />
        </div>
      </div>
    </div>
  );
}

// 🔧 Dashboard Card Component
function DashboardCard({
  title,
  value,
  percentage,
  iconClass,
  percentageColor = "text-lime-500",
  chartType = "line",
  data = [],
  strokeColor = "#22c55e",
  fillColor = "#bbf7d0",
}) {
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data}>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" fill={strokeColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={data}>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                fill={fillColor}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full px-3 mb-6 sm:w-1/2 xl:w-1/4">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500 font-semibold">{title}</p>
              <h5 className="text-xl font-bold text-gray-800">
                {value}
                <span className={`ml-2 text-sm ${percentageColor}`}>{percentage}</span>
              </h5>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-md flex items-center justify-center shadow">
              <i className={`${iconClass} text-white text-lg`} />
            </div>
          </div>
          <div className="h-16">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
}










// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gray-100 ">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
//         <div className="flex items-center justify-between mb-2">
//           <h4 className="text-3xl font-bold text-gray-900">Dashboard</h4>
//         </div>
//       </div>
//       <div className="flex flex-wrap mx-3">
//         {/* Card 1 */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="flex-none w-2/3 max-w-full px-3">
//                   <div>
//                     <p className="mb-0 font-sans font-semibold leading-normal text-sm">
//                       Today's Money
//                     </p>
//                     <h5 className="mb-0 font-bold whitespace-nowrap">
//                       $53,000
//                       <span className="leading-normal text-sm font-weight-bolder text-lime-500">
//                         +55%
//                       </span>
//                     </h5>
//                   </div>
//                 </div>
//                 <div className="px-3 text-right basis-1/3">
//                   <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 ">
//                     <i className="leading-none far fa-money-bill text-lg relative top-3.5 text-white"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 2 */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="flex-none w-2/3 max-w-full px-3">
//                   <div>
//                     <p className="mb-0 font-sans font-semibold leading-normal text-sm">
//                       Today's Users
//                     </p>
//                     <h5 className="mb-0 font-bold">
//                       2,300
//                       <span className="leading-normal text-sm font-weight-bolder text-lime-500">
//                         +3%
//                       </span>
//                     </h5>
//                   </div>
//                 </div>
//                 <div className="px-3 text-right basis-1/3">
//                   <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 ">
//                     <i className="far leading-none fa-user text-lg relative top-3.5 text-white"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 3 */}
//         <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="flex-none w-2/3 max-w-full px-3">
//                   <div>
//                     <p className="mb-0 font-sans font-semibold leading-normal text-sm">
//                       New Clients
//                     </p>
//                     <h5 className="mb-0 font-bold">
//                       +3,462
//                       <span className="leading-normal text-red-600 text-sm font-weight-bolder">
//                         -2%
//                       </span>
//                     </h5>
//                   </div>
//                 </div>
//                 <div className="px-3 text-right basis-1/3">
//                   <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 ">
//                     <i className="leading-none far fa fa-scroll text-lg relative top-3.5 text-white"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 4 */}
//         <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
//           <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
//             <div className="flex-auto p-4">
//               <div className="flex flex-row -mx-3">
//                 <div className="flex-none w-2/3 max-w-full px-3">
//                   <div>
//                     <p className="mb-0 font-sans font-semibold leading-normal text-sm">
//                       Sales
//                     </p>
//                     <h5 className="mb-0 font-bold whitespace-nowrap">
//                       $103,430
//                       <span className="leading-normal text-sm font-weight-bolder text-lime-500">
//                         +5%
//                       </span>
//                     </h5>
//                   </div>
//                 </div>
//                 <div className="px-3 text-right basis-1/3">
//                   <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 ">
//                     <i className=" leading-none far fa-shopping-cart text-lg relative top-3.5 text-white"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
