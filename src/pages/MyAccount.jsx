import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/MyAccount.css';
import { setIsLogged } from '../store/slices/isLogged.slice';
import getConfig from '../utils/getConfig';
import Form from "react-bootstrap/Form";
import PhoneInput from 'react-phone-input-2';
import Button from "react-bootstrap/Button";

function MyAccount() {
  const dispatch = useDispatch();
  const { userId, userName, userFirstName, userLastName, userEmail, userPhone, profileImageUrl } 
    = useSelector((state) => state.isLogged);

  const [editMode, setEditMode] = useState(false);
  const [newUserName, setNewUserName] = useState(userName);
  const [newFirstName, setNewFirstName] = useState(userFirstName);
  const [newLastName, setNewLastName] = useState(userLastName);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newPhone, setNewPhone] = useState(userPhone);

  const handleSaveChanges = () => {
    axios.put(`http://localhost:8080/api/v1/users/${userId}`, {
      userName: newUserName,
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      phone: newPhone
    }, getConfig())
    .then(response => {
      dispatch(setIsLogged({
        userId,
        userName: newUserName,
        userFirstName: newFirstName,
        userLastName: newLastName,
        userEmail: newEmail,
        userPhone: newPhone,
        profileImageUrl: response.data.profileImageUrl // Actualiza la URL de la imagen de perfil si es necesario
      }));
      localStorage.setItem("profileImageUrl", response.data.profileImageUrl); // Actualiza el localStorage
      setEditMode(false);
    })
    .catch(error => {
      console.error('Error updating profile:', error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/users/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...getConfig().headers
          }
        }
      );

      console.log("Image uploaded successfully:", response.data);

      // Actualiza el estado de la imagen de perfil en Redux
      dispatch(setIsLogged({
        userId,
        userName,
        userFirstName,
        userLastName,
        userEmail,
        userPhone,
        profileImageUrl: response.data.profileImageUrl // Actualiza la URL de la imagen de perfil
      }));
      localStorage.setItem("profileImageUrl", response.data.profileImageUrl); // Actualiza el localStorage
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className='my-account'>
      <div className='account-title-content'>
        <h1 className='account-title'>Account Information</h1>
      </div>
      
      <div className='content'>
        <div className='account-content'>
          <div className='profile-section'>
            <div className='profile-image-container'>
              
                <div className='default-profile-image'>
                  <img
                    src={profileImageUrl} // Utiliza la URL de la imagen de perfil del estado
                    alt='Profile'
                    className='profile-image'
                  />
                </div>
        
            </div>
            {/* Etiqueta label personalizada para el botón de selección de imagen */}
            <label className='file-upload-label'>
              <FontAwesomeIcon icon={faPenToSquare} className='upload-icon' />
              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageUpload(e)}
                hidden
              />
              EDIT
            </label>
          </div>
          
          {editMode ? (
            <div className='user-info-inputs'>
              <div className='user-info-input'>
                <strong>USER</strong>
                <Form.Control
                  type="text"
                  className='new-user-name'
                  onChange={(e) => setNewUserName(e.target.value)}
                  value={newUserName}
                  placeholder="New user"
                  autoComplete="user-name"
                  name="userName"
                  required
                />
              </div>
              <div className='user-info-input'>
                <strong>NAME</strong>
                <div className='user-info-double-input'>
                  <Form.Control className='new-first-name' id="formBasicFirstName"
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="First name"
                    autoComplete="user-name"
                    name="firstName"
                    required
                  /> <hr />
                  <Form.Control className='new-last-name' id="formBasicLastName"
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="Last name"
                    autoComplete="user-name"
                    name="lastName"
                    required
                  />
                </div>
              </div>
              <div className='user-info-input'>
                <strong>EMAIL</strong>
                <Form.Control
                  className='new-email'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="user-name"
                  name="email"
                  required
                  readOnly
                />
              </div>
              <div className='user-info-input'>
                <strong>PHONE</strong>
                <div className='input-phone-container'>
                  <PhoneInput
                    className="new-phone"
                    value={newPhone}
                    onChange={(phone) => setNewPhone(phone)}
                    inputProps={{
                      required: true,
                    }}
                  />  
                </div>
              </div>
              <div className='button-save-container'>
                <Button className='button-save-update-user' onClick={handleSaveChanges} variant="warning" type="submit">
                  Save
                </Button>
              </div>
              <div className='button-cancel-container'>
                <Button className='button-cancel-update-user' onClick={() => setEditMode(false)} variant="warning" type="submit">
                  Cancel
                </Button>
              </div>  
            </div>
          ) : (
            <div className='user-info'>
              <div>
                <strong>USER</strong>
                <p>{userName}</p>
              </div>
              <div>
                <strong>NAME</strong>
                <p>{userFirstName} {userLastName}</p>
              </div>
              <div>
                <strong>EMAIL</strong>
                <p>{userEmail}</p>
              </div>
              <div>
                <strong>PHONE</strong>
                <p>+{userPhone}</p>
              </div>
              <Button className='button-update-user-container' variant='warning' onClick={() => setEditMode(true)}>
                UPDATE
              </Button>
            </div>
          )}
       
        </div>
      </div>
    </div>
  );
}

export default MyAccount;



