import { createSlice } from "@reduxjs/toolkit";

const initialUserName = localStorage.getItem("userName") || '';
const initialUserFirstName = localStorage.getItem("userFirstName") || '';
const initialUserLastName = localStorage.getItem("userLastName") || '';
const initialUserEmail = localStorage.getItem("userEmail") || '';
const initialUserPhone = localStorage.getItem("userPhone") || '';

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  userName: initialUserName,
  userFirstName: initialUserFirstName,
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
      state.userFirstName = action.payload.userFirstName;
      state.userLastName = action.payload.userLastName;
      state.userPhone = action.payload.userPhone;
      localStorage.setItem("userNane", action.payload.userName);
      localStorage.setItem("userFirstName", action.payload.userFirstName);
      localStorage.setItem("userLastName", action.payload.userLastName);
      localStorage.setItem("userEmail", action.payload.userEmail);
      localStorage.setItem("userPhone", action.payload.userPhone);
    },
    clearLogin: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      state.token = null;
      state.isLoggedIn = false;
      state.userName = '';
      state.userFirstName = '';
      state.userLastName = '';
      state.userEmail = '';
      state.userPhone = '';
    },
  },
});

export const { setIsLogged, clearLogin } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;