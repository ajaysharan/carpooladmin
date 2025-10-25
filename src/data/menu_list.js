export default [
  {
    name: "Dashboard",
    icon: "fa-solid fa-gauge-high",
    url: `/admin`,
  },
  // {
  //   name: "Enquiry",
  //   icon: "fa-solid fa-address-card",
  //   url: `/admin/enquiry`,
  // },
  // {
  //   name: "Faq Requests",
  //   icon: "fa-solid fa-clipboard-question",
  //   url: `/admin/faqrequest`,
  // },

  {
    name: "Master",
    icon: "fa-solid fa-sparkles",
    children: [
      {
        name: "Role",
        url: `/admin/role`,
      },
      {
        name: "All Customer",
        url: `/admin/user`,
        // children: [
        //   {
        //     name:"edit",
        //     url: `/admin/user/edit/:id`,
        //   }
        // ]
      },
      {
        name: "Drivers",
        url: `/admin/drivers`,
      },
      {
        name: "EnquiryContact",
        url: `/admin/EnquiryContact`,
      },
      {
        name: "Passengers",
        url: `/admin/passengers`,
      },
      {
        name: "Rides",
        url: `/admin/rides`,
      },
      {
        name: "Bookings",
        url: `/admin/bookings`,
      },
    ],
  },

  {
    name: "Content",
    icon: "fa-regular fa-solid fa-photo-film",
    children: [
      // {
      //   name: "Banner",
      //   icon: "fa-solid fa-image",
      //   url: `/admin/banner`,
      // },
      {
        name: "CMS Pages",
        icon: "fa-solid fa-image",
        url: `/admin/cms_page`,
      },
      // {
      //   name: "Testimonial",
      //   url: `/admin/testimonial`,
      // },
      // {
      //   name: "Our Team",
      //   url: `/admin/ourteam`,
      // },
      // {
      //   name: "Sponsor",
      //   url: `/admin/sponsor`,
      // },
      // {
      //   name: "FAQ Category",
      //   icon: "fa-solid fa-image",
      //   url: `/admin/faqCategory`,
      // },
      // {
      //   name: "Faq",
      //   url: `/admin/faq`,
      // },
    ],
  },

  {
    name: "Location",
    icon: "fa-solid fa-location-dot",
    children: [
      {
        name: "Country",
        url: `/admin/country`,
      },
      {
        name: "State",
        url: `/admin/state`,
      },
      {
        name: "City",
        url: `/admin/city`,
      },
    ],
  },


  {
    name: "Our Service",
    icon: "fa-solid fa-users-rays",
    children: [
      {
        name: "OurServicesList",
        url: `/admin/our-service`,
      },
     
    ],
  },
  {
    name: "Chat",
    icon: "fa-regular fa-envelope fa-bounce",
    children: [
      {
        name: "Chat List ",
        url: `/admin/chat`,
      },
      {
        name: "Chat List 2 ",
        url: `/admin/chatCopy`,
      },
     
    ],
  },

  {
    name: "App Setting",
    icon: "fa-solid fa-gear fa-spin",
    children: [
      {
        name: "General Setting",
        url: `/admin/general-settings/1`,
      },
      {
        name: "Email Setting",
        url: `/admin/general-settings/2`,
      },
      {
        name: "Social Links Setting",
        url: `/admin/general-settings/3`,
      },
      {
        name: "Performance Overview",
        url: `/admin/general-settings/4`,
      },
    ],
  },
];
