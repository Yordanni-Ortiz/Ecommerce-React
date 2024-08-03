import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPurchasesThunk } from "/src/store/slices/userPurchases.slice";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ModalPurchases from "../components/ModalPurchases";
import "/src/assets/styles/Purchases.css";

const Purchases = () => {
    const [show, setShow] = useState(false);
    const [dataSelected, setDataSelected] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const userPurchases = useSelector((state) => state.userPurchases);
    const accountCreationDate = new Date(useSelector((state) => state.isLogged.createdAt));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserPurchasesThunk());
    }, [dispatch]);

    useEffect(() => {
    }, [userPurchases]);

    const sortedPurchases = userPurchases?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const currentDate = new Date();

    const createDateOptions = (startDate, endDate, type) => {
        const options = [];
        const isMonthType = type === 'month';
        let current = new Date(startDate.getFullYear(), isMonthType ? startDate.getMonth() : 0);

        while (current <= endDate) {
            options.push({
                value: isMonthType ? current.getMonth() : current.getFullYear(),
                label: isMonthType ? current.toLocaleString('default', { month: 'long' }) : current.getFullYear()
            });
            isMonthType ? current.setMonth(current.getMonth() + 1) : current.setFullYear(current.getFullYear() + 1);
        }

        return options;
    };

    const validMonths = createDateOptions(accountCreationDate, currentDate, 'month');
    const validYears = createDateOptions(accountCreationDate, currentDate, 'year');

    useEffect(() => {
        if (!selectedMonth) setSelectedMonth(validMonths.find(m => m.value === new Date().getMonth()) || validMonths[0]);
        if (!selectedYear) setSelectedYear(validYears.find(y => y.value === new Date().getFullYear()) || validYears[0]);
    }, [validMonths, validYears]);

    const filterPurchasesByMonth = (purchases, month, year) =>
        purchases.filter(purchase => {
            const purchaseDate = new Date(purchase.createdAt);
            return purchaseDate >= accountCreationDate && purchaseDate.getMonth() === month && purchaseDate.getFullYear() === year;
        });

    const purchasesForSelectedMonth = filterPurchasesByMonth(
        sortedPurchases,
        selectedMonth?.value || new Date().getMonth(),
        selectedYear?.value || new Date().getFullYear()
    );

    return (
        <Container id="purchases" className="my-4">
            <div className="container-purchases">
                <h2>My purchases</h2>
                <hr />
                <div className="filter-container">
                    <Select
                        className="select-month"
                        classNamePrefix="select"
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        options={validMonths}
                    />
                    <Select
                        className="select-year"
                        classNamePrefix="select"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={validYears}
                    />
                </div>
                {purchasesForSelectedMonth.length > 0 ? (
                    purchasesForSelectedMonth.map(purchase => (
                        <Card className="card-purchases" key={purchase.id}>
                            <Card.Header>
                                <Card.Text className="backgrond">
                                    <span className="time">
                                        <span className="day">{purchase.createdAt.slice(0, 10)}</span>
                                        <span className="hour">{purchase.createdAt.slice(11, 19)}</span>
                                    </span>
                                    <span className="quantity">quantity</span>
                                    <span className="price">price</span>
                                </Card.Text>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text className="title">{purchase.product?.title}</Card.Text>
                                <Card.Text>{purchase.quantity}</Card.Text>
                                <Card.Text>${purchase.product?.price}</Card.Text>
                            </Card.Body>
                            <Button className="button-details" variant="warning" onClick={() => {
                                setDataSelected(purchase);
                                setShow(true);
                            }}>
                                See details
                            </Button>
                        </Card>
                    ))
                ) : (
                    <p className="no-purchases-found">No purchases found for this period.</p>
                )}

                <ModalPurchases show={show} handleClose={() => setShow(false)} data={dataSelected} />
            </div>
        </Container>
    );
};

export default Purchases;
