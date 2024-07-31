import React from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "/src/assets/styles/ModalPay.css";
import { useNavigate } from "react-router-dom";

const ModalPay = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  }

  return (
    <div>
      <Modal id="modal-pay" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Electronic Shop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='message-modal-add-product' >
            <p className="mt-4">Are you sure you want to proceed with this purchase?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="login-button" variant="warning" onClick={handleNavigate}>
            ACEPT
          </Button>
          <Button className="login-button" variant="warning" onClick={handleClose}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalPay;