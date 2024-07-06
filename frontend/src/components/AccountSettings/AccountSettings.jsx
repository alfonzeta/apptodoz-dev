import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { todos_URL, users_URL } from '../../storage/storage';
import HandleDate from '../../logic/HandleDate';

export default function AccountSettings() {

  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [oldPassword, setOldPassword] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordRepeat, setPasswordRepeat] = useState(null)
  const [nameInput, setNameInput] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState("")
  const [showRemoveModal, setShowRemoveModal] = useState(false)


  const emptyInputs = () => {
    setPassword(null)
    setOldPassword(null)
    setPasswordRepeat(null)
    setFirstName(user.firstName)
    setLastName(user.lastName)
  }


  const handleUpdatePassword = (e) => {
    e.preventDefault()

    if (password !== passwordRepeat) {
      setShowErrorMessage(true)
      setErrorMessage("Passwords do not match")
      return
    }

    const newPassword = {
      oldPassword: oldPassword,
      password: password
    }



    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newPassword)
    }
    fetch(`${users_URL}/password/${user._id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setShowForm(false)

        } else {
          setShowErrorMessage(true)
          setErrorMessage(data.error)
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  const handleUpdateName = (e) => {
    e.preventDefault()


    const newUserName = {
      firstName: firstName,
      lastName: lastName
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newUserName)
    }
    fetch(`${users_URL}/${user._id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setShowForm(false)
          setUser(data.updatedUser)
          localStorage.setItem("user", JSON.stringify(data.updatedUser))
          const requestOptionsAuthor = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ author: newUserName })
          }
          fetch(`${todos_URL}/updateAuthor`, requestOptionsAuthor)
            .then(res => res.json())
            .then(data => {
            })
        } else {
          setShowErrorMessage(true)
          setErrorMessage(data.error)
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleRemoveAccount = (e) => {
    e.preventDefault()

    const requestOptionsContacts = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ removeContact: user._id })
    }
    fetch(`${users_URL}/removeAccount/${user._id}`, requestOptionsContacts)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {

          const requestOptionsCollaborators = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ removeCollaborator: user._id })
          }
          fetch(`${todos_URL}/removeAccount`, requestOptionsCollaborators)
            .then(res => res.json())
            .then(data => {
              if (data.ok) {
                handleLogout()
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  const accountList = () => {
    return (

      <ul className='account-info'>
        <li onClick={(e) => { emptyInputs(), e.target.localName !== "input" && e.target.localName !== "svg" && showForm === 1 ? setShowForm(false) : setShowForm(1) }} >
          <div className='account-info-li'>
            <p>Change your password</p>
            <p>********</p>
          </div>

          {showForm === 1
            &&
            <>

              {showErrorMessage &&
                <p style={{ color: "red" }}>{errorMessage}</p>
              }

              <div className='form-container-password' >
                <form className='change-password-form' onSubmit={(e) => handleUpdatePassword(e)} action="">
                  <small>Type your current password</small>
                  <input onChange={(e) => { setOldPassword(e.target.value), setShowErrorMessage(false) }} type="password" />
                  <small>Type your new password</small>
                  <input onChange={(e) => { setPassword(e.target.value), setShowErrorMessage(false) }} type="password" />
                  <small>Repeat your new password</small>
                  <input onChange={(e) => { setPasswordRepeat(e.target.value), setShowErrorMessage(false) }} type="password" />
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <FaCheck size={"25px"} color='white' type="submit" onClick={handleUpdatePassword} />

                    <RxCross2 size={"25px"} color='white' style={{ cursor: "pointer" }} onClick={() => setShowForm(false)} />
                  </div>
                </form>
              </div>
            </>
          }
        </li>
        <hr />
        <li onClick={(e) => { emptyInputs(), e.target.localName !== "input" && e.target.localName !== "svg" && showForm === 2 ? setShowForm(false) : setShowForm(2) }}>
          <div className='account-info-li'>
            <p>Change your name</p>
            <p>{user.firstName}</p>
          </div>
          {showForm === 2
            &&
            <>
              {showErrorMessage &&
                <p style={{ color: "red" }}>{errorMessage}</p>}



              <div className='form-container-password' >
                <form className='change-password-form' onSubmit={(e) => handleUpdateName(e)} action="">
                  <small>Type your new name</small>
                  <input onChange={(e) => { setFirstName(e.target.value), setShowErrorMessage(false) }} type="text" />
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <FaCheck size={"25px"} color='white' type="submit" onClick={handleUpdateName} />

                    <RxCross2 size={"25px"} color='white' style={{ cursor: "pointer" }} onClick={() => setNameInput(!nameInput)} />
                  </div>
                </form>
              </div>
            </>
          }
        </li>
        <hr />
        <li onClick={(e) => { emptyInputs(), e.target.localName !== "input" && e.target.localName !== "svg" && showForm === 3 ? setShowForm(false) : setShowForm(3) }}>
          <div className='account-info-li'>
            <p>Change your last name</p>
            <p>{user.lastName}</p>
          </div>
          {showForm === 3
            &&
            <>
              {showErrorMessage &&
                <p style={{ color: "red" }}>{errorMessage}</p>}



              <div className='form-container-password' >
                <form className='change-password-form' onSubmit={(e) => handleUpdateName(e)} action="">
                  <small>Type your new last name</small>
                  <input onChange={(e) => { setLastName(e.target.value), setShowErrorMessage(false) }} type="text" />
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <FaCheck size={"25px"} color='white' type="submit" onClick={handleUpdateName} />

                    <RxCross2 size={"25px"} color='white' style={{ cursor: "pointer" }} onClick={() => setNameInput(!nameInput)} />
                  </div>
                </form>
              </div>
            </>
          }
        </li>
        <hr />
        <li>
          <div className='account-info-li'>
            <p>Your e-mail</p>
            <p>{user.email}</p>
          </div>
        </li>
        <hr />
        <li>
          <div className='account-info-li'>
            <p>Account Created</p>
            <p>{HandleDate(user.timestamp)}</p>
          </div>
        </li>
        <li>
          <div className='account-info-li'>
            <p>Username</p>
            <p>{user.username}</p>
          </div>
        </li>
        <hr />
        <li onClick={handleLogout}>
          <div className='account-info-li'>
            <p>Sign Out</p>

          </div>
        </li>
      </ul>
    )
  }

  const removeAccount = () => {
    return (
      <div className='remove-div'>
        <button className='remove-account' onClick={() => setShowRemoveModal(!showRemoveModal)}>Remove account</button>
        {showRemoveModal &&
          <div className='remove-modal'>
            <h5>Are you sure you want to remove your account?</h5>
            <button onClick={(e) => handleRemoveAccount(e)}>Yes</button>
            <button onClick={(e) => setShowRemoveModal(false)}>No</button>
          </div>
        }
      </div>
    )
  }

  return (
    <>
      <div className='account-settings-container'>
        {accountList()}
        {removeAccount()}
      </div>
    </>
  )
}
