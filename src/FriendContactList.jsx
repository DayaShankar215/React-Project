import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./FriendContactList.css";

const FriendContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);

  const navigate = useNavigate(); // Initialize navigation
  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Retrieve the logged-in user

  useEffect(() => {
    // Load contacts for the current user from localStorage
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
    saveContactsToStorage(updatedContacts); // Save to localStorage
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
    saveContactsToStorage(updatedContacts); // Save to localStorage
    setIsEditing(false);
    setNewContact({ name: "", phone: "" });
    setCurrentContactIndex(null);
  };

  const deleteContact = (index) => {
    const filteredContacts = contacts.filter((_, i) => i !== index);
    setContacts(filteredContacts);
    saveContactsToStorage(filteredContacts); // Save to localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Clear the current user session
    navigate("/"); // Redirect to the login page

  };

  return (
    <div className="contact-list-container">
      <header className="header">
        <h1>Friend Contact List</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <form onSubmit={isEditing ? updateContact : addContact}>
        <div className="form-field">
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={newContact.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={newContact.phone}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="submit-btn">
          {isEditing ? "Update Contact" : "Add Contact"}
        </button>
      </form>

      <h2>Contact List</h2>
      {contacts.length === 0 ? (
        <p>No contacts available. Add a contact to get started!</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((contact, index) => (
            <li key={index} className="contact-item">
              <div>
                <strong>Name:</strong> {contact.name} <br />
                <strong>Phone:</strong> {contact.phone}
              </div>
              <div className="actions">
                <button onClick={() => editContact(index)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => deleteContact(index)}
                  className="delete-btn"
                >
                  Delete
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
