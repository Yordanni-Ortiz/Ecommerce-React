import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import { setIsLoading } from "./isLoading.slice";
import { removeCartProductThunk } from "./cartProducts.slice";

export const getUserPurchasesThunk = createAsyncThunk(
    'userPurchases/getUserPurchases',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/purchases', getConfig());
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const userPurchasesSlice = createSlice({
    name: 'userPurchases',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserPurchasesThunk.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(getUserPurchasesThunk.rejected, (state, action) => {
                console.error('Failed to fetch user purchases:', action.payload);
            });
    },
});

export const addUserPurchaseThunk = (purchaseData) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const response = await axios.post(
            "http://localhost:8080/api/v1/purchases",
            {
                ...purchaseData
            },
            getConfig()
        );
        console.log("Add User Purchase Response:", response.data);
        await dispatch(getUserPurchasesThunk()); // Actualiza las compras del usuario después de agregar una compra
        await dispatch(removeCartProductThunk()); // Limpia el carrito después de agregar una compra
        dispatch(setIsLoading(false));
    } catch (error) {
        console.error("Add User Purchase Error:", error);
        dispatch(setIsLoading(false));
    }
}

export const {
    setUserPurchases
} = userPurchasesSlice.actions;

export default userPurchasesSlice.reducer;
