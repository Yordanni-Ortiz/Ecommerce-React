import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { Button, Col, Row, Card } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { addCartProductThunk } from "../store/slices/cartProducts.slice";
import Container from "react-bootstrap/Container";
import '../assets/styles/Product.css'
import { Cart, CheckLg } from "react-bootstrap-icons";
import ModalAddProducts from "../components/ModalAddProduct"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const products = useSelector((state) => state.getProducts);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    dispatch(setIsLoading(true));
    axios
      .get(`http://localhost:8080/api/v1/products/${id}/`)
      .then((resp) => {
        console.log("Productos en general", resp.data)
        setDetail(resp?.data);
        filterClass(resp?.data?.categoryId);
      })
      .catch((error) => console.error(error))
      .finally(() => dispatch(setIsLoading(false)));
  }, [id]);

  useEffect(() => {
    // Aquí puedes verificar si el usuario está autenticado, por ejemplo, comprobando un token en el localStorage
    const token = localStorage.getItem('token'); // Supongamos que guardas el token en localStorage
    setIsAuthenticated(!!token); // Actualiza el estado de autenticación
  }, []);

  const filterClass = (category) => {
    const productsFiltered = products.filter((p) => p.categoryId == category);
    setProductsByCategory(productsFiltered);
  };

  const handleAddCart = (product) => {
    dispatch(addCartProductThunk(product, count));
    successful()
  };

  const successful = () => toast("✔ Product add to cart successfully.", {
    autoClose: 2000, 
  });


  return (
    <div className="container-product" >
      <Container className="my-5">
        <div>
          <Row xs={1} md={2} lg={2}>
            <Col lg={6}>
              <div className="carousel">
                <Carousel fade variant="dark" interval="15000">
                  <Carousel.Item
                    style={{
                      padding: "3rem 4rem",
                      display: "flex",
                      justifyContent: "center",
                      width: "100% ",
                    }}
                  >
                    <img
                      style={{
                        height: "400px",
                        objectFit: "contain",
                      }}
                      // className="carousel_img"
                      src={detail?.productImgs?.[0].url}
                      alt="First slide"
                    />
                  </Carousel.Item>

                  <Carousel.Item
                    style={{
                      padding: "3rem 4rem",
                      display: "flex",
                      justifyContent: "center",
                      width: "100% ",
                    }}
                  >
                    <img
                      style={{
                        height: "400px",
                        objectFit: "contain",
                      }}
                      // className="carousel_img"
                      src={detail?.productImgs?.[1].url}
                      alt="Second slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item
                    style={{
                      padding: "3rem 4rem",
                      display: "flex",
                      justifyContent: "center",
                      width: "100% ",
                    }}
                  >
                    <img
                      style={{
                        height: "400px",
                        objectFit: "contain",
                      }}
                      // className="carousel_img"
                      src={detail?.productImgs?.[2].url}
                      alt="Third slide"
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
            </Col>
            <Col
              lg={6}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2>{detail.title}</h2>

              <p>{detail.description}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h5>Price</h5>
                  <p>
                    <strong>${detail.price}</strong>
                  </p>
                </div>
                <div>
                  <h5>Quantity</h5>
                  <div style={{ display: "flex" }}>
                    <Button
                      onClick={() =>
                        count === 1 ? setCount(count) : setCount(count - 1)
                      }
                      variant="secondary"
                    >
                      -
                    </Button>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {count}
                    </div>
                    <Button
                      onClick={() => setCount(count + 1)}
                      variant="secondary"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Button 
                  variant="warning" 
                  onClick={() => isAuthenticated ? handleAddCart(detail) : handleShow()}>
                  add to cart
                </Button>
              </div>
            </Col>
          </Row>

          <hr />
          <br />
          <h3>Related products</h3>
          <br />
          <Row xs={1} md={2} lg={3}>
            {productsByCategory?.map((producItem) => (
              <Col key={producItem.id}>
                <Card style={{ margin: "1rem" }}>
                  <Carousel variant="dark" interval="15000">
                    <Carousel.Item className="cards">
                      <img
                        className="d-block w-100"
                        src={producItem.productImgs[0].url}
                        style={{ height: 300, objectFit: "contain" }}
                        alt="First slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item className="cards">
                      <img
                        className="d-block w-100"
                        src={producItem.productImgs[1].url}
                        style={{ height: 300, objectFit: "contain" }}
                        alt="Second slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item className="cards w-100">
                      <img
                        className="d-block w-100"
                        src={producItem.productImgs[2].url}
                        style={{ height: 300, objectFit: "contain" }}
                        alt="Third slide"
                      />
                    </Carousel.Item>
                  </Carousel>
                  <Card.Body className="card__body">
                    <Card.Title>{producItem.title}</Card.Title>
                    <Card.Text>${producItem.price}</Card.Text>
                    <div className="bu">
                      <Button
                        variant="light"
                        as={Link}
                        to={`/product/${producItem.id}`}
                      >
                        Details
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => handleAddCart(detail)}
                      >
                        <Cart />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <ModalAddProducts
          show={show} 
          handleClose={handleClose} 
        />
        <ToastContainer
          position="top-center" 
          pauseOnHover={true}
        />
      </Container>
    </div>
  );
};
export default Product;
