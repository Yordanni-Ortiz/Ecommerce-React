import { createSlice } from "@reduxjs/toolkit";

const initialUserName = localStorage.getItem("userName") || '';
const initialUserLastName = localStorage.getItem("userLastName") || '';
const initialUserEmail = localStorage.getItem("userEmail") || '';
const initialUserPhone = localStorage.getItem("userPhone") || '';

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  userName: initialUserName,
  userLastName: initialUserLastName,
  userEmail: initialUserEmail,
  userPhone: initialUserPhone
};

export const isLoggedSlice = createSlice({
  name: "isLogged",
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      const token = localStorage.getItem("token");
      state.token = token;
      state.isLoggedIn = !!token;
      state.userName = action.payload.userName;
      state.userLastName = action.payload.userLastName;
      state.userPhone = action.payload.userPhone;
      localStorage.setItem("userName", action.payload.userName);
      localStorage.setItem("userLastName", action.payload.userLastName);
      localStorage.setItem("userEmail", action.payload.userEmail);
      localStorage.setItem("userPhone", action.payload.userPhone);
    },
    clearLogin: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      state.token = null;
      state.isLoggedIn = false;
      state.userName = '';
      state.userLastName = '';
      state.userEmail = '';
      state.userPhone = '';
    },
  },
});

export const { setIsLogged, clearLogin } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;