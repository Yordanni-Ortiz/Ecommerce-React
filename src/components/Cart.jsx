// Dentro de Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";
import { Trash } from "react-bootstrap-icons";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import {
  getCartProductsThunk,
  removeCartProductThunk,
  updateCartProductThunk,
} from "/src/store/slices/cartProducts.slice";
import { addUserPurchaseThunk } from "/src/store/slices/userPurchases.slice";
import { setIsLoading } from "/src/store/slices/isLoading.slice";
import { setCartProducts } from "/src/store/slices/cartProducts.slice";
import "/src/assets/styles/Cart.css";

function Cart({ sendLaunch, launch }) {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const cartProducts = useSelector((state) => state.cartProducts);
  const getProducts = useSelector((state) => state.getProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCartProductsThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    prepareProducts();
    setTotal(
      cartProducts.reduce(
        (accum, currentValue) =>
          accum + Number(currentValue.product.price) * currentValue.quantity,
        0
      )
    );
  }, [cartProducts, getProducts]);

  const cleanCart = async () => {
    try {
      dispatch(setIsLoading(true));
  
      const ids = cartProducts.map((product) => product.id);
      console.log("ids:", ids)
      // Recorre los IDs y elimina cada producto uno por uno
      ids.forEach(async (id) => {
        console.log(`Eliminando producto con ID: ${id}`);
        await dispatch(removeCartProductThunk(id));
    });
      // Después de eliminar todos los productos, actualizar el estado del carrito
      dispatch(setCartProducts([]));
    } catch (error) {
      console.error('Error cleaning cart:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  
  const removeProduct = async (id) => {
    console.log('Removiendo ID del carrito cart:', id);
    try {
      // Despacha el Thunk correctamente usando dispatch
      await dispatch(removeCartProductThunk(id));
    } catch (error) {
      console.error('Error removing product Cart:', error);
      throw error;
    }
  };
  

  const handleClose = () => sendLaunch(false);

  const handlePurchase = (url) => {
    dispatch(addUserPurchaseThunk({}));
    cleanCart();
    handleNavigate(url);
  };

  const handleNavigate = (url) => {
    navigate(url);
    handleClose();
  };

  const prepareProducts = () => {
    if (getProducts) {
      const preparedProducts = cartProducts.map((cartProduct) => {
        const foundProduct = getProducts.find(
          (product) => product.id === cartProduct?.productId
        );
        if (foundProduct) {
          return {
            ...cartProduct,
            product: foundProduct,
          };
        } else {
          return cartProduct;
        }
      });
      setProducts(preparedProducts);
      console.log("Prepared Products:", preparedProducts);
    } else {
      setProducts(cartProducts);
    }
  };

  const handleUpdateQuantity = (operation, product) => {
    let newQuantity = product?.quantity;

    if (operation === "subs") {
      newQuantity = Math.max(1, newQuantity - 1); // Evita cantidades negativas
    } else if (operation === "add") {
      newQuantity++; // Incrementa la cantidad
    }

    dispatch(updateCartProductThunk(product.id, newQuantity));
  };

  return (
    <Offcanvas show={launch} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ListGroup variant="flush">
          {products.map((product, index) => (
            <ListGroup.Item id="card-item" key={index}>
              <span id="quantity">{product.quantity}</span>
              <div id="item-data">
                <figure
                  id="card-img"
                  onClick={() =>
                    handleNavigate(`/product/${product.product.id}`)
                  }
                >
                  <img
                    src={product.product?.productImgs?.[0].url}
                    alt={`This is a ${product.product?.title} image`}
                  />
                  <figcaption>{product.product.title}</figcaption>
                  <span>Price</span>
                  <span>{`${product.product.price}`}</span>
                </figure>
                <span
                  id="substract-product"
                  onClick={() => handleUpdateQuantity("subs", product)}
                >
                  -
                </span>
                <span
                  id="add-product"
                  onClick={() => handleUpdateQuantity("add", product)}
                >
                  +
                </span>
                <span
                  id="card-trash"
                  onClick={() =>  removeProduct(product.id)}
                >
                  <Trash id="trash" />
                </span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div id="cart-total">
          <span>Total</span>
          <span>{`$${total}`}</span>
        </div>
        <Button
          id="cart-checkout"
          variant="warning"
          onClick={() => handlePurchase("/purchases")}
        >
          Buy
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Cart;
