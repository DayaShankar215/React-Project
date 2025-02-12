import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendContactList.css";
import { FaEdit, FaTrash, FaSignOutAlt, FaUserPlus } from "react-icons/fa";

const FriendContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser) {
      const storedContacts = JSON.parse(localStorage.getItem("friendContactList")) || {};
      setContacts(storedContacts[currentUser.email] || []);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const saveContactsToStorage = (updatedContacts) => {
    const allContacts = JSON.parse(localStorage.getItem("friendContactList")) || {};
    allContacts[currentUser.email] = updatedContacts;
    localStorage.setItem("friendContactList", JSON.stringify(allContacts));
  };

  const addContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      alert("Please fill out both fields!");
      return;
    }
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
    setNewContact({ name: "", phone: "" });
  };

  const editContact = (index) => {
    setNewContact(contacts[index]);
    setIsEditing(true);
    setCurrentContactIndex(index);
  };

  const updateContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      alert("Please fill out both fields!");
      return;
    }
    const updatedContacts = contacts.map((contact, index) =>
      index === currentContactIndex ? newContact : contact
    );
    setContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
    setIsEditing(false);
    setNewContact({ name: "", phone: "" });
    setCurrentContactIndex(null);
  };

  const deleteContact = (index) => {
    const filteredContacts = contacts.filter((_, i) => i !== index);
    setContacts(filteredContacts);
    saveContactsToStorage(filteredContacts);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="contact-list-container">
      <header className="header">
        <h1>Friend Contact List</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <form onSubmit={isEditing ? updateContact : addContact} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={newContact.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={newContact.phone}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">
          {isEditing ? "Update" : "Add"} Contact <FaUserPlus />
        </button>
      </form>

      <h2>Contact List</h2>
      {contacts.length === 0 ? (
        <p className="no-contacts">No contacts available. Add a contact to get started!</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((contact, index) => (
            <li key={index} className="contact-item">
              <div className="contact-details">
                <strong>{contact.name}</strong>
                <span>{contact.phone}</span>
              </div>
              <div className="actions">
                <button onClick={() => editContact(index)} className="edit-btn">
                  <FaEdit />
                </button>
                <button onClick={() => deleteContact(index)} className="delete-btn">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendContactList;