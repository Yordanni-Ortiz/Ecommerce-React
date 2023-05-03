import { useSelector, useDispatch } from "react-redux"
import Carousel from 'react-bootstrap/Carousel'
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { getProductsThunk } from "../store/slices/getProducts.slice"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {Cart} from 'react-bootstrap-icons'
import axios from "axios"
import '../assets/styles/Products.css'
import getConfig from "/src/utils/getConfig";
import {addCartProductThunk} from "/src/store/slices/cartProducts.slice";
import FormGroup from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";

const Products= () => {
  const product = useSelector( state => state.getProducts )
  const [categories, setCategories] = useState([])
  const [productsFiltered, setProductsFiltered] = useState ([])
  const [input, setInput] = useState("");
  const [range, setRange] = useState({min: 0, max: 0});
  const [styles, setStyles] = useState({});
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(getProductsThunk());
    axios
      .get(`https://ecommerce-api-ze05.onrender.com/api/v1/categories`)
      .then((resp) => setCategories(resp?.data))
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    setProductsFiltered(product);
  }, [product]);

  const filterByCategory = (e) => {
    const name = e.target.name;
    const productsFiltered = product.filter((p) => p.category.name == name);
    setProductsFiltered(productsFiltered);
  };

  const filterByName = () => {
    const productsFiltered = product.filter((prdt) =>
      prdt.title.toLowerCase().includes(input)
    );

    setProductsFiltered(productsFiltered);
  };

  const filterByPrice = () => {
    const productsFiltered = product.filter((prdt) => {
      if (
        (!range.min || prdt.price >= Number(range.min)) &&
        (prdt.price <= Number(range.max) || !range.max)
      )
        return true;
      return false;
    });

    setProductsFiltered(productsFiltered);
  };

  const handleAddCart = (product) => {
    dispatch(addCartProductThunk(product, 1));
  };
  
  return (
    <>
      <Nav className="nav-products">
	<Nav.Item>
	  <Nav.Link
	    style={styles["-1"]}
	    onClick={() => {
	      dispatch(getProductsThunk());
	      
	    }}
	  >All Products</Nav.Link>
	</Nav.Item>
	{
	  categories.map(category => {
            return (
              <Nav.Item key={category.id}>
	        <Nav.Link
		  id={category.id.toString()}
		  name={category.name}
		  style={styles[category.id]}
		  onClick={filterByCategory}
	        >{category.name}</Nav.Link>
	      </Nav.Item>
	    );
	  })
	}
      </Nav>
      <Container className="mt-2">
        <Row xs={1} md={2}>
	  <Col className="mt-2">
          <InputGroup>
	    
	    <Form.Control
	      type="text"
        placeholder="Search product"
	      value={input}
              onChange={event => setInput(event.target.value.toLowerCase())}
	    />
	    <Button variant="warning" onClick={filterByName}>Search</Button>
	  </InputGroup>
	  </Col>
	  <Col className="mt-2">
          <InputGroup>
	    <InputGroup.Text>Price</InputGroup.Text>
	    <Form.Control
	      type="number"
	      value={range.min}
              onChange={event => setRange({
		...range,
		min: event.target.value
	      })}
	    />
	    <Form.Control
	      type="number"
	      value={range.max}
              onChange={event => setRange({
		...range,
	        max: event.target.value
	      })}
	    />
	    <Button variant="warning" onClick={filterByPrice}>Search</Button>
	  </InputGroup>
	  </Col>
        </Row>
        <Row xs={1} md={2} lg={3}>
          {
           productsFiltered?.map(producItem => (
          
          <Col key={producItem.id}>
            <Card className="container__cards">
              {/* inicio de carousel */}
              <Carousel interval='15000'>
                  <Carousel.Item className="cards">
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[0]}
                      style={{height:200, width:200, objectFit:'cover'}}
                      alt="First slide"
                    />
                    
                  </Carousel.Item>
                  <Carousel.Item className="cards">
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[1]}
                      style={{height:200, objectFit:'cover'}}
                      alt="Second slide"
                    />

                    
                  </Carousel.Item>
                  <Carousel.Item className="cards w-100" >
                    <img
                      className="d-block w-100"
                      src={producItem.productImgs[2]}
                      style={{height:200, objectFit:'cover'}}
                      alt="Third slide"
                    />

                    
                  </Carousel.Item>
              </Carousel>
              
              <Card.Body className="card__body">
                  <Card.Title>{producItem.title}</Card.Title>
                  <Card.Text>
                   ${producItem.price}
                  </Card.Text>
                  <div className="bu">
                  <Button variant="light"  as={ Link } to={`/product/${producItem.id}`}>Details</Button>
                  <Button variant="warning"  onClick={() => handleAddCart(producItem) }><Cart/></Button> 
                  </div>
                                   
                  {/* crear condiconal para entrar al carrito */}
                </Card.Body>
              </Card>
          </Col>
          ) ) }
        </Row>
      </Container>
    </>
  )
}

export default Products
