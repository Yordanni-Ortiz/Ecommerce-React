import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";
import "/src/assets/styles/Cart.css";
import { Trash } from "react-bootstrap-icons";
import axios from "axios";
import getConfig from "/src/utils/getConfig";
import { useSelector, useDispatch } from "react-redux";
import {
  getCartProductsThunk,
  removeCartProductThunk,
  updateCartProductThunk,
} from "/src/store/slices/cartProducts.slice";
import { addUserPurchaseThunk } from "/src/store/slices/userPurchases.slice";
import { setIsLoading } from "/src/store/slices/isLoading.slice";
import { setCartProducts } from "/src/store/slices/cartProducts.slice";

function Cart({ sendLaunch, launch }) {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const cartProducts = useSelector((state) => state.cartProducts);
  const getProducts = useSelector((state) => state.getProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCartProductsThunk());
  }, []);

  useEffect(() => {
    prepareProducts();
    setTotal(
      cartProducts.reduce(
        (accum, currentValue) =>
          accum + Number(currentValue.product.price) * currentValue.quantity,
        0
      )
    );
  }, [cartProducts]);

  const dropProduct = (id) => {
    dispatch(setIsLoading(true));
    axios
      .delete(
        "https://ecommerce-api-94zo.onrender.com/api/v1/cart/" + id,
        getConfig()
      )
      .then((res) => dispatch(getCartProductsThunk()))
      .catch((err) => console.log(err.response))
      .finally(() => dispatch(setIsLoading(false)));
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

  const cleanCart = () => {
    const ids = cartProducts.map((product) => product.id);
    ids.forEach((id) => dropProduct(id));
    dispatch(setCartProducts([]));
  };

  const prepareProducts = () => {
    if(getProducts)
	{
            setProducts(cartProducts.map(product => {
                const productImgs = getProducts?.find(getProduct => getProduct.id === product.id).productImgs.url;
	        return {
                    ...product,
	            productImgs
	        };
	    }));
	} setProducts(cartProducts);
  };

  const handleUpdateQuantity = (operation, product) => {
    let newQuantity = product.quantity;

    if (operation == "subs") {
      newQuantity--;
    } else if (operation == "add") {
      newQuantity++;
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
          {products.map((product, index) => {
            return (
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
                      src={product.product?.productImgs[0].url}
                      alt={`This is a ${product.product.title} image`}
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
                    onClick={() => dispatch(removeCartProductThunk(product.id))}
                  >
                    <Trash id="trash" />
                  </span>
                </div>
              </ListGroup.Item>
            );
          })}
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
