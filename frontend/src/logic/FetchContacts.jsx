import React, { useEffect } from 'react'
import { users_URL } from '../storage/storage';

export default function FetchContacts(setContacts, triggerFetchContacts) {

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    useEffect(() => {
      setContacts([])
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }
      fetch(`${users_URL}${user._id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            const { users } = data;
            const contactsIdsArray = users[0].contacts
            contactsIdsArray.map(async contactId => {
              const res = await fetch(`${users_URL}/contact/${contactId.contactId}`, requestOptions);
              const contactData = await res.json();
              if (contactData.ok && contactData.users.length > 0) {
                contactData.users[0].timestamp = contactId.timestamp
                setContacts(prevContacts => [...prevContacts, contactData.users[0]]);
              } else if (contactData.users.length < 1) {
                console.log("No contacts to fetch");
              } else {
                throw new Error("Failed to fetch contact data");
              }

            });
          } else {
            throw new Error("Failed to fetch user data");
          }
        }).catch(error => {
          console.error(error);
        });
    }, [triggerFetchContacts])
  )
}




