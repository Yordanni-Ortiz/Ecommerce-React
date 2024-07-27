import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
      ids.forEach(async (id) => {
        await dispatch(removeCartProductThunk(id));
      });
      dispatch(setCartProducts([]));
    } catch (error) {
      console.error('Error cleaning cart:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  
  const removeProduct = async (id) => {
    try {
      await dispatch(removeCartProductThunk(id));
    } catch (error) {
      console.error('Error removing product Cart:', error);
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
    } else {
      setProducts(cartProducts);
    }
  };

  const handleUpdateQuantity = (operation, product) => {
    let newQuantity = product?.quantity;

    if (operation === "subs") {
      newQuantity = Math.max(1, newQuantity - 1);
    } else if (operation === "add") {
      newQuantity++;
    }

    dispatch(updateCartProductThunk(product.id, newQuantity));
  };

  return (
    <>
      {launch && <div className="cart-overlay" onClick={handleClose}></div>}
      <div className={`cart-container ${launch ? 'show' : ''}`}>
        <button className="cart-close" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2>Cart</h2>
        <div className="cart-items">
          {products.map((product, index) => (
            <div className="cart-item" key={index}>
              <span className="cart-quantity">{product.quantity}</span>
              <div className="item-data">
                <figure
                  className="item-img"
                  onClick={() =>
                    handleNavigate(`/product/${product.product.id}`)
                  }
                >
                  <img
                    src={product.product?.productImgs?.[0].url}
                    alt={`This is a ${product.product?.title} image`}
                  />
                  <figcaption><strong className="product-title">{product.product.title}</strong></figcaption>
                  <span>Price</span>
                  <span><strong className="price-product-cart">${`${product.product.price}`}</strong></span>
                </figure>
                <button
                  className="update-quantity subtract"
                  onClick={() => handleUpdateQuantity("subs", product)}
                >
                  -
                </button>
                <button
                  className="update-quantity add"
                  onClick={() => handleUpdateQuantity("add", product)}
                >
                  +
                </button>
                <button
                  className="remove-product"
                  onClick={() => removeProduct(product.id)}
                >
                  <Trash className="trash-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <span>Total</span>
          <span>{`$${total}`}</span>
        </div>
        <div className="button-pay-container">
          <Button
          variant="warning"
          className="checkout-button"
          onClick={() => handlePurchase("/purchases")}
          >
            BUY
          </Button>
        </div>
        
      </div>
    </>
  );
}

export default Cart;