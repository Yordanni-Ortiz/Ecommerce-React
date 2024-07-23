import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import { setIsLoading } from "./isLoading.slice";

const cartProductsSlice = createSlice({
  name: 'cartProducts',
  initialState: [],
  reducers: {
    setCartProducts: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cleanCart.fulfilled, (state, action) => {
        return action.payload; // Actualiza el estado del carrito con el payload del thunk
      })
      .addCase(cleanCart.rejected, (state, action) => {
        console.error('Error limpiando el carrito:', action.error);
      });
  },
});

export const { setCartProducts } = cartProductsSlice.actions;

export const getCartProductsThunk = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get("http://localhost:8080/api/v1/cart", getConfig());
    console.log("Fetched Cart Products:", res.data);
    dispatch(setCartProducts(res.data));
  } catch (err) {
    console.error("Error fetching cart products:", err);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const addCartProductThunk = (product, quantity) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    await axios.post("http://localhost:8080/api/v1/cart", { productId: product.id, quantity }, getConfig());
    dispatch(getCartProductsThunk());
  } catch (err) {
    console.error("Error adding product to cart:", err);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const updateCartProductThunk = (id, newQuantity) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.put(`http://localhost:8080/api/v1/cart/${id}`, { quantity: newQuantity }, getConfig());
    console.log("Response:", response.data);
    dispatch(getCartProductsThunk());
  } catch (err) {
    console.error("Error updating product quantity:", err);
    // Manejar el error adecuadamente, por ejemplo:
    if (err.response && err.response.status === 404) {
      console.error(`Product with ID ${id} not found.`);
      // Podrías mostrar un mensaje de error al usuario
    } else {
      console.error("Unexpected error occurred:", err.message);
      // Podrías manejar otros tipos de errores aquí
    }
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Thunk para limpiar el carrito
export const cleanCart = createAsyncThunk(
  'cartProducts/cleanCart',
  async (_, { dispatch, getState }) => {
    dispatch(setIsLoading(true));
    try {
      // Obtener los productos actuales del carrito desde el estado
      const cartProducts = getState().cartProducts;
      
      // Mapear los IDs de los productos en el carrito
      const ids = cartProducts.map((product) => product.id);
      console.log("IDs a eliminar:", ids);
      
      // Usar un bucle para eliminar cada producto
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        console.log(`Intentando eliminar producto con ID: ${id}`);
        
        if (id !== undefined) {
          await dispatch(removeCartProductThunk(id));
          console.log(`Producto con ID: ${id} eliminado`);
        } else {
          console.warn(`ID indefinido encontrado en la posición ${i}`);
        }
      }
      
      // Devolver un array vacío para limpiar el estado del carrito
      return [];
    } catch (error) {
      console.error('Error limpiando el carrito:', error);
      throw error;
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);


export const removeCartProductThunk = (id) => async (dispatch) => {
  console.log("ID recibido para eliminación:", id);
  
  if (!id) {
    console.error('ID is undefined or null:', id);
    return; // Agrega una salida temprana si id no está definido
  }
  
  console.log('Removing product with ID:', id);
  dispatch(setIsLoading(true));
  
  try {
    await axios.delete(`http://localhost:8080/api/v1/cart/${id}`, getConfig());
    dispatch(getCartProductsThunk()); // Actualiza los productos del carrito después de eliminar uno
    console.log(`Product with ID ${id} removed from cart`);
  } catch (err) {
    console.error('Error removing product from cart:', err.response);
  } finally {
    dispatch(setIsLoading(false));
  }
};


export default cartProductsSlice.reducer;