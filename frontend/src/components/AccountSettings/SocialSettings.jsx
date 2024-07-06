import { IoTrashBin } from "react-icons/io5";
import React, { useEffect, useState } from 'react'
import { requests_URL, users_URL } from '../../storage/storage'
import ReceivedRequests from './ReceivedRequests'
import PendingRequests from './PendingRequests'
import FetchRequests from '../../logic/FetchRequests'
import FetchContacts from '../../logic/FetchContacts'
import HandleDate from '../../logic/HandleDate'

export default function SocialSettings() {

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const [contactSearch, setContactSearch] = useState("")
  const [contactFound, setContactFound] = useState("")
  const [showReceived, setShowReceived] = useState(true)
  const [showPending, setShowPending] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false)
  const [triggerFetchContacts, setTriggerFetchContacts] = useState(false)
  const [contacts, setContacts] = useState([])
  const [errorMessage, setErrorMessage] = useState(false)
  const [buttonJSX, setButtonJSX] = useState("")
  const [triggerButton, setTriggerButton] = useState(false)
  FetchRequests("PENDING", setPendingRequests, "recipient", triggerFetch)
  FetchRequests("RECEIVED", setReceivedRequests, "sender", triggerFetch)
  FetchContacts(setContacts, triggerFetchContacts)



  const handleContactSearch = (e) => {

    e.preventDefault()
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    }
    fetch(`${users_URL}/user/${contactSearch}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data.username !== user.username && data.ok) {
          setTriggerButton(!triggerButton)
          setContactFound(data)
        } else if (data.username === user.username) {
          setErrorMessage("You can't add yourself as a contact")
        } else {
          setErrorMessage(data.message)
          setContactFound(null)

        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleAddContact = (e) => {
    e.preventDefault()

    const newRequest = {
      sender: user._id,
      recipient: contactFound.id
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newRequest)
    }
    fetch(`${requests_URL}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setTriggerFetch(!triggerFetch)
        setTriggerButton(!triggerButton)

      })
      .catch(error => {
        console.log(error);
      });

  }

  useEffect(() => {
    if (contacts.some(contact => contact.username === contactFound.username)) {
      setButtonJSX(<p>accepted</p>)
    }
    else if (receivedRequests.some(request => request.sender === contactFound.id)
      || pendingRequests.some(request => request.recipient === contactFound.id)) {
      setButtonJSX(<p>Pending</p>)
    } else if (contactFound.username) {

      setButtonJSX(<button onClick={handleAddContact}>Add contact</button>)
    }
  }, [contacts, triggerButton, pendingRequests, receivedRequests])

  const handleRemoveContact = (e, contact) => {
    e.preventDefault()

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    }
    fetch(`${requests_URL}${user._id}/${contact._id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        const requestOptionsDel = {
          method: "DELETE",
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }
        fetch(`${requests_URL}${data.receivedRequests[0]._id}`, requestOptionsDel)
          .then(res => res.json())
          .then(data => {


          })
          .catch(error => {
            console.log(error);
          });

      })
      .catch(error => {
        console.log(error);
      });

    const requestOptionsFirstContact = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ removeContact: contact._id })
    }
    fetch(`${users_URL}${user._id}`, requestOptionsFirstContact)
      .then(res => res.json())
      .then(data => {
      })
      .catch(error => {
        console.log(error);
      });

    const requestOptionsSecondContact = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ removeContact: user._id })
    }
    fetch(`${users_URL}${contact._id}`, requestOptionsSecondContact)
      .then(res => res.json())
      .then(data => {
      })
      .catch(error => {
        console.log(error);
      });

    setTriggerFetchContacts(!triggerFetchContacts)
  }

  return (
    <>
      <h4>Look for a contact</h4>
      <form onSubmit={handleContactSearch} action="">
        <input placeholder='search contact by username' onChange={(e) => { setContactSearch(e.target.value), setContactFound(null), setErrorMessage(null) }} type="text" name="" id="" />
      </form>

      {
        errorMessage ? <p style={{ color: "red", marginTop: "15px" }}>{errorMessage}</p> :
          contactFound &&
          <div className='contact-search-container'>
            <div className='contact-search'>
              <table className='todo-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>{contactFound.username}</p>
                    </td>
                    <td>
                      {buttonJSX}

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      }

      <div className='account-social-buttons'>
        <button className={showReceived ? "active-button" : undefined} onClick={() => { setShowReceived(true); setShowPending(false) }} >Received Requests</button>
        <button className={showPending ? "active-button" : undefined} onClick={() => { setShowPending(true); setShowReceived(false) }} >Pending Requests</button>
      </div>

      {showReceived
        ? <ReceivedRequests receivedRequests={receivedRequests} setTriggerFetchContacts={setTriggerFetchContacts} setTriggerFetch={setTriggerFetch} />
        : <PendingRequests setPendingRequests={setPendingRequests} pendingRequests={pendingRequests} setTriggerFetch={setTriggerFetch} />
      }
      <h3>Contacts</h3>
      {
        contacts && contacts.length < 1
          ? (<p>No contacts</p>)
          :
          <div className='todo-table-parent'>
            <div style={{ cursor: "default" }} className='todo-table-container'>
              <table className='todo-table'>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Last name</th>
                    <th>Contact since</th>
                  </tr>
                </thead>
                <tbody>
                  {(contacts.map((contact) => (
                    <tr>
                      <td style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <p key={contact.username}>{contact.username}</p>
                        <IoTrashBin style={{ cursor: "pointer" }} size={"25px"} color="white" onClick={(e) => handleRemoveContact(e, contact)}>x</IoTrashBin>
                      </td>
                      <td>
                        <p>{contact.firstName}</p>
                      </td>
                      <td>
                        <p>{contact.lastName}</p>
                      </td>
                      <td>
                        <p>{HandleDate(contact.timestamp)}</p>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>




      }



    </>
  )
}
