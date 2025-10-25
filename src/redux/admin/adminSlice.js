import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("isLogedIn") === "true",
  _id: "",
  name: "",
  email: "",
  mobile: "",
  token: "",
  image: "",
  roleName: "",
  roleId: "",
  permissions: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateAdmin: (state, action) => {
      let { fullname, email, mobile, image, role, _id, token } = action.payload;
      
      if (_id) state._id = _id;
      if (fullname) state.fullname = name;
      if (role) state.roleId = role?.id;
      if (role) state.roleName = role?.name;
      if (email) state.email = email;
      if (token) state.token = token;
      if (mobile) state.mobile = mobile;
      if (image) state.image = image;
    },
    loggedInAdmin: (state, action) => {
      localStorage.setItem("type", "admin");
      localStorage.setItem("isLogedIn", "true");

      let { user, email, mobile, image, role, _id } = action.payload;

      if (_id) state._id = _id;
      if (user) state.name = user;
      if (role) state.roleId = role;
      if (email) state.email = email;
      if (mobile) state.mobile = mobile;
      if (image) state.image = image;
      state.isLoggedIn = true;
    },
    loggedOutAdmin: (state) => {
      localStorage.removeItem("type");
      localStorage.removeItem("isLogedIn");
      state._id = "";
      state.name = "";
      state.email = "";
      state.mobile = "";
      state.image = "";
      state.roleId = "";
      state.roleName = "";
      state.isLoggedIn = false;
    },
    updatePermission: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAdmin, loggedInAdmin, loggedOutAdmin, updatePermission } =
  adminSlice.actions;

export default adminSlice.reducer;
