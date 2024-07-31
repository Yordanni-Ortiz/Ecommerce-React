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
import Modal from "react-bootstrap/Modal";
import "/src/assets/styles/ModalPay.css";

function Cart({ sendLaunch, launch }) {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
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

  const handleCloseModal = () => setShowModal(false);

  const handleShow = () => setShowModal(true);

  const handlePurchase = () => {
    dispatch(addUserPurchaseThunk({}));
    cleanCart();
    handleNavigate("/purchases");
    sendLaunch(false); // Cerrar el carrito solo cuando se concreta la compra
  };

  const handleNavigate = (url) => {
    navigate(url);
    handleCloseModal();
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
      {launch && <div className="cart-overlay" onClick={() => sendLaunch(false)}></div>}
      <div className={`cart-container ${launch ? 'show' : ''}`}>
        <button className="cart-close" onClick={() => sendLaunch(false)}>
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
            onClick={handleShow} // Mostrar el modal en lugar de proceder directamente
          >
            BUY
          </Button>
        </div>

        <Modal id="modal-pay" show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>Electronic Shop</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='message-modal-add-product' >
              <p className="mt-4">Are you sure you want to proceed with this purchase?</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="accept-buy-button" variant="warning" onClick={handlePurchase}>
              ACCEPT
            </Button>
            <Button className="cancel-buy-button" variant="warning" onClick={handleCloseModal}>
              CANCEL
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Cart;
