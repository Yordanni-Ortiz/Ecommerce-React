import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Carousel from 'react-bootstrap/Carousel';
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../store/slices/getProducts.slice";
import { addCartProductThunk } from "/src/store/slices/cartProducts.slice";
import { Cart } from 'react-bootstrap-icons';
import "../assets/styles/Products.css";
import { Form } from "react-bootstrap";
import ReactSlider from 'react-slider';
import '../assets/styles/RanglerSlider.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAddProducts from "../components/ModalAddProduct";
import Pagination from "../components/Pagination";

const Products = () => {
  const products = useSelector((state) => state.getProducts);
  const [categories, setCategories] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  
  useEffect(() => {
    dispatch(getProductsThunk());
    axios
      .get(`http://localhost:8080/api/v1/categories`)
      .then((resp) => setCategories(resp?.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    setProductsFiltered(products);
  }, [products]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const filterByCategory = (e) => {
    const name = e.target.name;
    const productsFiltered = products.filter((p) => p.category.name === name);
    setProductsFiltered(productsFiltered);
    setCurrentPage(1); // Reset page to 1 when filtering
  };

  const filterByName = () => {
    const productsFiltered = products.filter((prdt) =>
      prdt.title.toLowerCase().includes(input)
    );
    setProductsFiltered(productsFiltered);
    setCurrentPage(1); // Reset page to 1 when filtering
  };

  const filterByPrice = () => {
    const productsFiltered = products.filter((prdt) => {
      return prdt.price >= priceRange[0] && prdt.price <= priceRange[1];
    });
    setProductsFiltered(productsFiltered);
    setCurrentPage(1); // Reset page to 1 when filtering
  };

  const handleAddCart = (product) => {
    dispatch(addCartProductThunk(product, 1));
    console.log("Producto agregado al carrito", product);
    successful();
  };

  const successful = () => toast("✔ Product add to cart successfully.", {
    autoClose: 2000
  });

  // Calcular los productos actuales
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsFiltered.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <Nav className="nav-products">
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              dispatch(getProductsThunk());
              setCurrentPage(1);
            }}
          >
            All Products
          </Nav.Link>
        </Nav.Item>
        {categories.map((category) => (
          <Nav.Item key={category.id}>
            <Nav.Link
              id={category.id.toString()}
              name={category.name}
              onClick={filterByCategory}
            >
              {category.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Container className="mt-2">
        <Row className="row" xs={1} md={2}>
          <Col className="mt mt-3">
            <InputGroup>
              <Form.Control
                className="search-products"
                type="text"
                placeholder="Search product"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value.toLowerCase())
                }
              />
              <Button variant="warning" onClick={filterByName}>
                Search
              </Button>
            </InputGroup>
          </Col>
          <Col className="mt mt-3" >
            <div className="range-slider">
              <h5 className="rangler-slider-title" >Price</h5>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="thumb"
                trackClassName="track"
                min={0}
                max={5000}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
                onAfterChange={filterByPrice}
                renderThumb={(props) => <div {...props}><div className="interior-thumb"></div></div>}
              />
              <div className="price-range">
                <span>${priceRange[0]}</span> - <span>${priceRange[1]}</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3}>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Col key={product.id}>
                <Card className="container__cards">
                  <Carousel variant="dark" interval={15000}>
                    {product.productImgs.map((img, index) => (
                      <Carousel.Item key={index} className="cards">
                        <img
                          className="d-block w-100"
                          src={img.url}
                          style={{ height: 300, objectFit: "contain" }}
                          alt={`Slide ${index}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Card.Body className="card__body">
                    <Card.Title className="card_title">{product.title}</Card.Title>
                    <Card.Text>${product.price}</Card.Text>
                    <div className="bu">
                      <Button
                        variant="light"
                        as={Link}
                        to={`/product/${product.id}`}
                      >
                        Details
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => isAuthenticated ? handleAddCart(product) : handleShow()}
                      >
                        <Cart />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="container-alert">
              <img className="image-alert" src="/alert.png" alt="No products found" style={{ width: "80%" }} />
              <h3 className="text-alert">NO SE HAN ENCONTRADO PRODUCTOS CON ESA ESPECIFICACION.</h3>
            </Col>
          )}
        </Row>
        <ModalAddProducts
          show={show} 
          handleClose={handleClose} 
        />
        <ToastContainer
          position="top-center" 
          pauseOnHover={true}
        />
      </Container>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(productsFiltered.length / productsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default Products;



