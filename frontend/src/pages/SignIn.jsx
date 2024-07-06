import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./SignIn.css"
import { login_URL } from '../storage/storage';


export default function SignIn({ message }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [password, setPassword] = useState("")



  const handleSignUp = (e) => {
    e.preventDefault()
    navigate("/signup")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const loginUser = {
      email: email,
      password: password,
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginUser)
    }

    fetch(login_URL, requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('storedId', data.user._id)
          localStorage.setItem("user", JSON.stringify(data.user))
          navigate("/todos/")
        } else {
          setShowMessage(!showMessage)
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  return (
    <div className='sign-in-parent'>
      <div className='sign-in-child'>
        <div>
          <video loop={true} muted={true} autoPlay={true} playsInline={true} type="video/mp4" src="/video2.mp4">sef</video>
        </div>
        <div className='sign-in-form-parent'>
          {showMessage &&
            <p className='error-message'>Incorrect email or password</p>
          }
          {message && <p>{message}</p>}
          <form className='sign-in-form' onSubmit={handleSubmit} action="">
            <input onChange={(e) => { setShowMessage(false), setEmail(e.target.value) }} type="text" placeholder='email' />
            <input onChange={(e) => { setShowMessage(false), setPassword(e.target.value) }} type="password" placeholder='password' />
            <input type="submit" value="Log In" />
          </form>
          <p>Don't have an account? <a href="signup" onClick={handleSignUp}>Create one!</a></p>

        </div>
      </div>
    </div>
  )
}
