import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import {setIsLoading} from "./isLoading.slice";

export const cartProductsSlice = createSlice({
    name: "cartProducts",
    initialState: [],
    reducers: {
	setCartProducts: (state, action) => action.payload
    }
});

export const getCartProductsThunk = () => dispatch => {
    dispatch(setIsLoading(true));
    axios
	.get("https://ecommerce-api-ze05.onrender.com/api/v1/cart", getConfig())
	.then(res => dispatch(setCartProducts(res.data.data)))
	.catch(err => err.response.status !== 404 && console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const addCartProductThunk = (product, quantity) => dispatch => {
    dispatch(setIsLoading(true));
    axios
	.post(
	    "https://ecommerce-api-ze05.onrender.com/api/v1/cart", 
	    {productId: product.id, quantity},
	    getConfig()
	)
	.then(res => dispatch(getCartProductsThunk(res.data)))
	.catch(err => console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const updateCartProductThunk = (id, newQuantity) => dispatch => {
    dispatch(setIsLoading(true));
    axios
	.patch("https://ecommerce-api-ze05.onrender.com/api/v1/cart", {id, newQuantity}, getConfig())
	.then(res => dispatch(getCartProductsThunk()))
	.catch(err => console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const removeCartProductThunk = id => dispatch => {
    dispatch(setIsLoading(true));
    axios
	.delete("https://ecommerce-api-ze05.onrender.com/api/v1/cart/" + id, getConfig())
	.then(res => dispatch(getCartProductsThunk()))
	.catch(err => console.log(err.response))
	.finally(() => dispatch(setIsLoading(false)));
}

export const {
    setCartProducts
} = cartProductsSlice.actions;

export default cartProductsSlice.reducer;
