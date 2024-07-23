import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/MyAccount.css';

function MyAccount() {
  const userName = useSelector((state) => state.isLogged.userName.toUpperCase());
  const userLastName = useSelector((state) => state.isLogged.userLastName.toUpperCase());
  const userEmail = useSelector((state) => state.isLogged.userEmail);
  const userPhone = useSelector((state) => state.isLogged.userPhone);

  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
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
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt='Profile'
                  className='profile-image'
                />
              ) : (
                <div className='default-profile-image'>
                  <img
                  src='/user.jpg'
                  alt='Default Profile'
                  className='profile-image'
                />
                </div>
              )}
            </div>
            {/* Etiqueta label personalizada para el botón de selección de imagen */}
            <label className='file-upload-label'>
              <FontAwesomeIcon icon={faPenToSquare} className='upload-icon' />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='file-upload-input'
              />EDIT
            </label>
          </div>
          <div className='user-info'>
            <div>
              <strong>NAME</strong> 
              <p>{userName} {userLastName}</p>
            </div>
            <div>
              <strong>EMAIL</strong> 
              <p>{userEmail}</p> 
            </div>
            <div>
              <strong>PHONE</strong> 
              <p>+{userPhone}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;


