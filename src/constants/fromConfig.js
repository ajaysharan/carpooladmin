// import DEFAULT_IMAGE from "../assets/images/admin/team/avatar.png";
// export { DEFAULT_IMAGE };

export const FILE_SIZE = 2 * 1024 * 1024;
export const FILE_SIZE_video = 10 * 1024 * 1024;
export const MAX_INPUT_AMOUNT = 100000000;

export const SUPPORTED_FORMATS_IMAGE = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
];

export const SUPPORTED_FORMATS_VIDEO = ["video/mp4", "video/mkv", "video/avi"];

export const SUPPORTED_FORMATS_DOC = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "application/vnd.rar",
];

export const STATUS = [
  { id: 1, name: "Active" },
  { id: 2, name: "In-Active" },
];

export const RATING = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];


export const GENDER = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
  { id: "Other", name: "Other" },
];

export const PHONE_REG_EXP =
  /^(?:(?:\+|0{0,2})91(\s*|[-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];



export const CURRENCY = "₹";
