import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPurchasesThunk } from "/src/store/slices/userPurchases.slice";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ModalPurchases from "../components/ModalPurchases";
import "/src/assets/styles/Purchases.css";

const Purchases = () => {
    const [show, setShow] = useState(false);
    const [dataSelected, setDataSelected] = useState({});
    const userPurchases = useSelector((state) => state.userPurchases);
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = (info) => {
        setShow(true);
        setDataSelected(info);
    };

    useEffect(() => {
        dispatch(getUserPurchasesThunk());
    }, [dispatch]);

    useEffect(() => {
        console.log("User Purchases:", userPurchases); // Para depurar y verificar los datos
    }, [userPurchases]);

    return (
        <Container id="purchases" className="my-4">
            <div>
                <h2>My purchases</h2>
                <hr />
                {userPurchases && userPurchases.length > 0 ? (
                    userPurchases.map((purchase) =>
                         (
                            <Card key={purchase.id} style={{ margin: '1rem' }}>
                                <Card.Header>
                                    <Card.Text className="backgrond">
                                        <span className="time">
                                            <span className="day">{purchase.createdAt.slice(0, 10)}</span>
                                            <span className="hour">{purchase.createdAt.slice(11, 19)}</span >
                                        </span>
                                        <span className="quantity">quantity</span>
                                        <span className="price">price</span>
                                    </Card.Text>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Card.Text className="title">
                                        {purchase.product?.title}
                                    </Card.Text>
                                    <Card.Text> 
                                        {purchase.quantity}
                                    </Card.Text>
                                    <Card.Text>
                                        {purchase.product?.price}
                                    </Card.Text>
                                </Card.Body>
                                <Button 
                                    className="button-details" 
                                    variant="warning" 
                                    onClick={() => handleShow(purchase)}
                                >
                                    See details
                                </Button>
                            </Card>
                        )
                    )
                ) : (
                    <p>No purchases found.</p>
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
