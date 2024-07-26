import { createSlice } from "@reduxjs/toolkit";

const initialUserName = localStorage.getItem("userName") || '';
const initialUserFirstName = localStorage.getItem("userFirstName") || '';
const initialUserLastName = localStorage.getItem("userLastName") || '';
const initialUserEmail = localStorage.getItem("userEmail") || '';
const initialUserPhone = localStorage.getItem("userPhone") || '';
const initialUserId = localStorage.getItem("userId") || ''; // Verifica que initialUserId esté correctamente inicializado

const initialState = {
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  userName: initialUserName,
  userFirstName: initialUserFirstName,
  userLastName: initialUserLastName,
  userEmail: initialUserEmail,
  userPhone: initialUserPhone,
  userId: initialUserId // Asegúrate de que userId esté presente en el estado inicial
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
      state.userId = action.payload.userId; // Verifica que userId se actualice correctamente en el estado
      localStorage.setItem("userName", action.payload.userName);
      localStorage.setItem("userFirstName", action.payload.userFirstName);
      localStorage.setItem("userLastName", action.payload.userLastName);
      localStorage.setItem("userEmail", action.payload.userEmail);
      localStorage.setItem("userPhone", action.payload.userPhone);
      localStorage.setItem("userId", action.payload.userId); // Verifica que userId se guarde correctamente en localStorage
    },
    clearLogin: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userId"); // Añadido
      state.token = null;
      state.isLoggedIn = false;
      state.userName = '';
      state.userFirstName = '';
      state.userLastName = '';
      state.userEmail = '';
      state.userPhone = '';
      state.userId = '';
    },
  },
});

export const { setIsLogged, clearLogin } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;
