import {createSlice} from "@reduxjs/toolkit";

export const isLoggedSlice = createSlice({
    name: "isLogged",
    initialState: localStorage.getItem("token"),
    reducers: {
	setIsLogged: (state, action) => localStorage.getItem("token")
    }
});

export const {setIsLogged} = isLoggedSlice.actions;

export default isLoggedSlice.reducer;
