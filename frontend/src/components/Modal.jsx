import React from 'react';
import { Form } from 'react-bootstrap';
import '../styles/Modal.css';
import axios from 'axios';

const Modal = ({ isOpen, onClose, account}) => {
  if (!isOpen) return null;
  
  const updateUserService = "https://localhost:7053/api/users/" + account.id;
  
    const handleUpdate = async (e) => {
        e.preventDefault();
        let payload = {};

        if (account.role === "Hospital") {
                payload = {
                    firstName: "",
                    lastName: document.getElementsByName("name")[0].value,
                    role: document.getElementsByName("role")[0].value,
                    email: document.getElementsByName("email")[0].value,
                };
        }
        else {
             payload = {
                firstName: document.getElementsByName("firstName")[0].value,
                lastName: document.getElementsByName("lastName")[0].value,
                role: document.getElementsByName("role")[0].value,
                email: document.getElementsByName("email")[0].value,
            };
        }
        
        await axios.put(updateUserService, payload)
            .then(() => {
                onClose();
                window.location.reload();
            }
            )
            .catch((error) => {
                console.error(error);
            }
            );
    };
    
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {account.role === "Hospital" ?(
        <Form className="form-content">
            <label>Hospital's Name</label>
            <input type="text" name="name" defaultValue={(account.firstName === null ? "" : account.firstName)  + " " + account.lastName} />
            <label>Role</label>
            <select name="role" defaultValue={account.role}>
                <option value="Admin">Admin</option>
                <option value="Hospital">Hospital</option>
            </select>
            <label>Email</label>
            <input type="email" name="email" defaultValue={account.email} />
            <input type="submit" value="Update" className="updateBtn" onClick={handleUpdate}/>
        </Form>
        ) : (
        <Form className="form-content">
            <label>First Name</label>
            <input type="text" name="firstName" defaultValue={account.firstName} />
            <label>Last Name</label>
            <input type="text" name="lastName" defaultValue={account.lastName} />
            <label>Role</label>
            <select name="role" defaultValue={account.role}>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
            </select>
            <label>Email</label>
            <input type="email" name="email" defaultValue={account.email} />

            <input type="submit" value="Update" className="updateBtn" onClick={handleUpdate}/>
        </Form>
        )}
      </div>
    </div>
  );
};

export default Modal;