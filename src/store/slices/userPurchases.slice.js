import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import {setIsLoading} from "./isLoading.slice";
import {removeCartProductThunk} from "./cartProducts.slice";

export const userPurchasesSlice = createSlice({
    name: "userPurchases",
    initialState: [],
    reducers: {
        setUserPurchases: (state, action) => action.payload
    }
});

export const getUserPurchasesThunk = () => dispatch => {
    dispatch(setIsLoading(true));
    axios
        .get("https://ecommerce-api-ze05.onrender.com/api/v1/purchases", getConfig())
	.then(res => dispatch(setUserPurchases(res.data.data.purchases)))
	.catch(err => console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const addUserPurchaseThunk = purchase => dispatch => {
    dispatch(setIsLoading(true));
    axios
        .post(
	    "https://ecommerce-api-ze05.onrender.com/api/v1/purchases",
	    {
                street: "Green St. 1456",
                colony: "Southwest",
                zipCode: 12345,
                city: "USA",
                references: "Some references"
            },
	    getConfig()
	)
	.then(res => dispatch(getUserPurchasesThunk()))
	.catch(err => console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const {
    setUserPurchases
} = userPurchasesSlice.actions;

export default userPurchasesSlice.reducer;
