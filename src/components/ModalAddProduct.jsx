import React from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "/src/assets/styles/ModalAddProducts.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ModalPurchases = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  }

  return (
    <div>
      <Modal id="modal-purchase" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Electronic Shop</Modal.Title>
          <FontAwesomeIcon
            icon={faXmark}
            className="close-icon"
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className='message-modal-add-product' >
            <p className="mt-4">An active session has not been detected</p>
            <p>Do you want to log in?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="login-button" variant="warning" onClick={handleNavigate}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalPurchases;
