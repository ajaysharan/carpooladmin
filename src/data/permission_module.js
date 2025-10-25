// import menu_data from "../data/menu_data";
const permission_module = [];
const menu_data = [
  { id: 1, name: "Enquiry" },
  { id: 2, name: "Role" },
  { id: 3, name: "Cms_page" },
  { id: 4, name: "driver_verification" },
  { id: 5, name: "Banner" },
  { id: 6, name: "User" },
  { id: 7, name: "Sub_admin" },
  { id: 8, name: "Designation" },
  { id: 9, name: "FaqRequest" },
  { id: 10, name: "FaqCategory" },
  { id: 11, name: "Faq" },
  { id: 12, name: "Testimonial" },
  { id: 13, name: "OurTeam" },
  { id: 14, name: "Sponsor" },
  { id: 15, name: "Location" },
  { id: 16, name: "Country" },
  { id: 17, name: "State" },
  { id: 18, name: "City" },
  { id: 19, name: "Profile" },
  { id: 20, name: "SiteSetting" },
  { id: 21, name: "Condition" },
  { id: 22, name: "Booking" },
  { id: 23, name: "Ride" },
  { id: 24, name: "OurService" },
];

menu_data.map((link) => {
  permission_module.push({
    id: 1,
    module: link.name,
    all: false,
    view: false,
    add: false,
    edit: false,
    delete: false,
    export: false,
    import: false,
  });
});

export default permission_module;
