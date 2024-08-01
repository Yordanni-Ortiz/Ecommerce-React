import { createSlice } from "@reduxjs/toolkit";

const initialUserName = localStorage.getItem("userName") || '';
const initialUserFirstName = localStorage.getItem("userFirstName") || '';
const initialUserLastName = localStorage.getItem("userLastName") || '';
const initialUserEmail = localStorage.getItem("userEmail") || '';
const initialUserPhone = localStorage.getItem("userPhone") || '';
const initialUserId = localStorage.getItem("userId") || ''; 
const initialProfileImageUrl = localStorage.getItem("profileImageUrl") || '';

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  userName: initialUserName,
  userFirstName: initialUserFirstName,
  userLastName: initialUserLastName,
  userEmail: initialUserEmail,
  userPhone: initialUserPhone,
  userId: initialUserId,
  profileImageUrl: initialProfileImageUrl
};

export const isLoggedSlice = createSlice({
  name: "isLogged",
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      console.log("Payload:", action.payload);
      const token = localStorage.getItem("token");
      state.token = token;
      state.isLoggedIn = !!token;
      state.userName = action.payload.userName;
      state.userFirstName = action.payload.userFirstName;
      state.userLastName = action.payload.userLastName;
      state.userEmail = action.payload.userEmail;
      state.userPhone = action.payload.userPhone;
      state.userId = action.payload.userId;
      state.profileImageUrl = action.payload.profileImageUrl;
      localStorage.setItem("userName", action.payload.userName);
      localStorage.setItem("userFirstName", action.payload.userFirstName);
      localStorage.setItem("userLastName", action.payload.userLastName);
      localStorage.setItem("userEmail", action.payload.userEmail);
      localStorage.setItem("userPhone", action.payload.userPhone);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("profileImageUrl", action.payload.profileImageUrl);
    },
    clearLogin: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileImageUrl");
      state.token = null;
      state.isLoggedIn = false;
      state.userName = '';
      state.userFirstName = '';
      state.userLastName = '';
      state.userEmail = '';
      state.userPhone = '';
      state.userId = '';
      state.profileImageUrl = '';
    },
  },
});

export const { setIsLogged, clearLogin } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;
