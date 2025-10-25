import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { routePermission } from "./components/routePermission";

const routes = [
  {
    path: "/",
    element: React.createElement(Navigate, { to: "/admin", replace: true }),
  },
  {
    path: "/admin",
    lazy: async () => {
      let module = await import("./layouts/AdminLayout");
      return { Component: module.default };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          let module = await import("./pages/Dashboard");
          return { Component: module.default };
        },
      },
      {
        path: "tables",
        lazy: async () => {
          let module = await import("./pages/Table");
          return { Component: module.default };
        },
      },

      // ---- Role route --------------
      {
        path: "role",
        lazy: async () => {
          let module = await import("./pages/roles/RolesList");
          return { Component: routePermission(module.default, "Role") };
        },
      },
      {
        path: "role/create",
        lazy: async () => {
          let module = await import("./pages/roles/AddRole");
          return { Component: routePermission(module.default, "Role", "add") };
        },
      },
      {
        path: "role/edit/:id",
        lazy: async () => {
          let module = await import("./pages/roles/EditRole");
          return { Component: routePermission(module.default, "Role", "edit") };
        },
      },
      {
        path: "role/permission/:id",
        lazy: async () => {
          let module = await import("./pages/roles/Permission");
          return { Component: module.default };
        },
      },
      // chat  to customer
      {
        path: "chat",
        lazy: async () => {
          let module = await import("./pages/ChatTo/ChatPage");
          return { Component: routePermission(module.default, "Role") };
        },
      },
      {
        path: "chatCopy",
        lazy: async () => {
          let module = await import("./pages/ChatTo/ChatPageCopy");
          return { Component: routePermission(module.default, "Role") };
        },
      },

      // Admin Profile update 
      {
        path: "admin-profile",
        lazy: async () => {
          let module = await import("./pages/AdminProfile/AdminProfile");
          return { Component: routePermission(module.default, "Role") };
        },
      },


       // ---- OurService --------------
       {
        path: "our-service",
        lazy: async () => {
          let module = await import("./pages/OurService/OurServicesList");
          return { Component: routePermission(module.default, "Role") };
        },
      },
      {
        path: "our-service/create",
        lazy: async () => {
          let module = await import("./pages/OurService/AddOurServices");
          return { Component: routePermission(module.default, "Role", "add") };
        },
      },
      {
        path: "our-service/edit/:id",
        lazy: async () => {
          let module = await import("./pages/OurService/EditourServices");
          return { Component: routePermission(module.default, "Role", "edit") };
        },
      },
      // ---- User route | ['Passenger','Driver'] | All Users-----
      {
        path: "user",
        lazy: async () => {
          let module = await import("./pages/users/UserList");
          return { Component: routePermission(module.default, "User") };
        },
      },
      {
        path: "user/create",
        lazy: async () => {
          let module = await import("./pages/users/AddUser");
          return { Component: routePermission(module.default, "User", "add") };
        },
      },
      {
        path: "user/edit/:id",
        lazy: async () => {
          let module = await import("./pages/users/EditUser");
          return { Component: routePermission(module.default, "User", "edit") };
        },
      },
     
            // Notification/create
            {
              path: "notification",
              lazy: async () => {
                let module = await import("./pages/Notification/NotificationList");
                return { Component: module.default };
              },
            },
            {
              path: "notification/create",
              lazy: async () => {
                let module = await import("./pages/Notification/AddNotification");
                return { Component: routePermission(module.default, "User", "add") };
              },
            },
            {
              path: "notification/edit/:id",
              lazy: async () => {
                let module = await import("./pages/users/EditUser");
                return { Component: routePermission(module.default, "User", "edit") };
              },
            },

      //------ Driver Routes -----
      {
        path: "drivers",
        lazy: async () => {
          let module = await import("./pages/drivers/DriverList");
          return {
            Component: routePermission(module.default, "driver_verification"),
          };
        },
      },
      {
        path: "drivers/editDriver/:id",
        lazy: async () => {
          let module = await import("./pages/drivers/EditDriver");
          return {
            Component: routePermission(module.default, "driver_verification"),
          };
        },
      },

      //------ Passenger Routes -----
      {
        path: "passengers",
        lazy: async () => {
          let module = await import("./pages/passengers/Passengers");
          return {
            Component: routePermission(module.default, "User"),
          };
        },
      },
      {
        path: "EnquiryContact",
        lazy: async () => {
          let module = await import("./pages/enquiryContact/EnquiryContact");
          return {
            Component: routePermission(module.default, "User"),
          };
        },
      },
    

      // ---- Location route --------------
      {
        path: "country",
        lazy: async () => {
          let module = await import("./pages/locations/Country");
          return {
            Component: routePermission(module.default, "Country"),
          };
        },
      },
      {
        path: "state",
        lazy: async () => {
          let module = await import("./pages/locations/State");
          return {
            Component: routePermission(module.default, "State"),
          };
        },
      },
      {
        path: "city",
        lazy: async () => {
          let module = await import("./pages/locations/City");
          return {
            Component: routePermission(module.default, "City"),
          };
        },
      },

      // ============ CMS Pages Routes | module : Cms_page ==========
      {
        path: "cms_page",
        lazy: async () => {
          let module = await import("./pages/CMS_Pages/CmsPageList");
          return {
            Component: routePermission(module.default, "Cms_page"),
          };
        },
      },
      {
        path: "cms_page/create",
        lazy: async () => {
          let module = await import("./pages/CMS_Pages/AddCmsPage");
          return {
            Component: routePermission(module.default, "Cms_page", "add"),
          };
        },
      },

      {
        path: "cms_page/edit/:id",
        lazy: async () => {
          let module = await import("./pages/CMS_Pages/EditCmsPage");
          return {
            Component: routePermission(module.default, "Cms_page", "edit"),
          };
        },
      },
      // =========== Ride | start ========
      {
        path: "rides",
        lazy: async () => {
          let module = await import("./pages/Rides/RideList");
          return {
            Component: routePermission(module.default, "Ride"),
          };
        },
      },
      // =========== Ride | end ==========

      // =========== Bookings | start ========
      {
        path: "bookings",
        lazy: async () => {
          let module = await import("./pages/Bookings/BookingList");
          return {
            Component: routePermission(module.default, "Booking"),
          };
        },
      },
      // =========== Bookings | end ==========

      // ========== Logout =========
      {
        path: "logout",
        lazy: async () => {
          let module = await import("./pages/auth/Logout");
          return { Component: module.default };
        },
      },
      //  =======general setting ========
      {
        path: "general-settings/:type",
        lazy: async () => {
          let module = await import("./pages/GeneralSetting/GeneralSettings");
          return { Component: module.default };
        },
      },
     
     
      

      {
        path: "*",
        lazy: async () => {
          let module = await import("./pages/errors/NotFoundPage");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "/",
    lazy: async () => {
      let module = await import("./layouts/AdminAuthLayout");
      return { Component: module.default };
    },
    children: [
      {
        path: "login",
        lazy: async () => {
          let module = await import("./pages/auth/Login");
          return { Component: module.default };
        },
      },

      // {
      //   path: "forgot-password",
      //   lazy: async () => {
      //     let module = await import("./routes/admin/auth/ForgetPassword");
      //     return { Component: module.default };
      //   },
      // },
      // {
      //   path: "reset-password/:token",
      //   lazy: async () => {
      //     let module = await import("./routes/admin/auth/ResetPassword");
      //     return { Component: module.default };
      //   },
      // },

      {
        path: "*",
        lazy: async () => {
          let module = await import("./pages/errors/NotFoundPage");
          return { Component: module.default };
        },
      },
    ],
  },
];

const routerConfig = {
  basename: import.meta.env.BASE_URL,
};

export default createBrowserRouter(routes, routerConfig);
