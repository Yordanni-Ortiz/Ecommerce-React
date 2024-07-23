import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "/src/assets/styles/ModalPurchases.css";

const ModalPurchases = ({ show, handleClose, data }) => {
  if (!data || !data.product) {
    return; // o algún otro manejo adecuado para este caso
  }
  console.log("data", data)
  return (
    <div>
      <Modal id="modal-purchase" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Electronic Shop</Modal.Title>
          <Modal.Body>
          {data.createdAt && (
            <p>{` ${data.createdAt.slice(0, 10)} ${data.createdAt.slice(11, 19)}`}</p> 
          )}
          </Modal.Body>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Product</h5>
            <p>{data.product.title}</p>
          </div>
          <div>
            <h5>Price</h5>
            <p>{data.product.price}</p>
          </div>
          <div>
            <h5>Amount</h5>
            <p>{data.quantity}</p>
          </div>
          <div>
            <h5>Total to pay</h5>
            <p>{data.product.price * data.quantity}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalPurchases;
