import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import ModalPurchases from "../components/ModalPurchases";
import Container from "react-bootstrap/Container";
import {useDispatch, useSelector} from "react-redux";
import {getUserPurchasesThunk} from "/src/store/slices/userPurchases.slice";
import "/src/assets/styles/Purchases.css";

const Purchases = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (info) => {
        setShow(true)
        setDataSelected(info)
    }

    const [dataSelected, setDataSelected] = useState({});
    const userPurchases = useSelector(state => state.userPurchases);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserPurchasesThunk());
    }, []);

    return (
        <Container id="purchases" className="my-4">
        <div>
            <h2>My purchases</h2>
            <hr />
            {userPurchases.map((purchase) =>
                purchase.cart?.products?.map((item) => (
                    <Card key={item.id} style={{margin:'1rem'}}>
                        <Card.Header>{item.productsInCart?.createdAt.slice(0,10)}</Card.Header>
                        <Card.Body>
                            <Card.Text>{item.title}</Card.Text>
                            <Card.Text
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    border: "1px solid rgb(0, 0, 0)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {item.productsInCart.quantity}
                            </Card.Text>
                            <Card.Text>{item.price}</Card.Text>
                            <Button variant="primary" onClick={()=>handleShow(item)}>
                                see details
                            </Button>
                        </Card.Body>
                    </Card>
                ))
            )}
            <ModalPurchases 
            show={show} 
            handleClose={handleClose} 
            data={dataSelected}
            />
        </div>
        </Container>
    );
};

export default Purchases;
