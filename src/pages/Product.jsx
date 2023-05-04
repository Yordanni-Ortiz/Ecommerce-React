import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { Button, Col, Row, Card } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { addCartProductThunk } from "../store/slices/cartProducts.slice";
import Container from "react-bootstrap/Container";

import { Cart } from "react-bootstrap-icons";

const Product = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const products = useSelector((state) => state.getProducts);
  const [productsByCategory, setProductsByCategory] = useState([]);

  useEffect(() => {
    dispatch(setIsLoading(true));
    axios
      .get(`https://ecommerce-api-94zo.onrender.com/api/v1/products/${id}/`)
      .then((resp) => {
        setDetail(resp?.data);
        filterClass(resp?.data?.categoryId);
      })
      .catch((error) => console.error(error))
      .finally(() => dispatch(setIsLoading(false)));
  }, [id]);

  const filterClass = (category) => {
    const productsFiltered = products.filter((p) => p.categoryId == category);
    setProductsByCategory(productsFiltered);
  };

  const handleAddCart = (product) => {
    dispatch(addCartProductThunk(product, count));
  };

  return (
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
                    src={detail?.productImgs?.[0]}
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
                    src={detail?.productImgs?.[1]}
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
                    src={detail?.productImgs?.[2]}
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
                  <strong>{detail.price}</strong>
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
              <Button variant="warning" onClick={() => handleAddCart(detail)}>
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
                <Carousel interval="15000">
                  <Carousel.Item className="cards">
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[0]}
                      style={{ height: 200, width: 200, objectFit: "cover" }}
                      alt="First slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item className="cards">
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[1]}
                      style={{ height: 200, objectFit: "cover" }}
                      alt="Second slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item className="cards w-100">
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[2]}
                      style={{ height: 200, objectFit: "cover" }}
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
                      onClick={() => dispatch(addProduct(producItem))}
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
    </Container>
  );
};
export default Product;
