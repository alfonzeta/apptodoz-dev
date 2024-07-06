import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./SignIn.css"
import { useParams } from "react-router-dom";
import SignIn from './SignIn';
import { signUp_URL } from '../storage/storage';


export default function verificatedAccount() {
  const { token } = useParams();
  const [isVerified, setIsVerified] = useState(false)
  const [message, setMessage] = useState("")

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  fetch(`${signUp_URL}/activate?token=${token}`, requestOptions)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
    })
    .catch(error => {
      console.log(error);
    });

  return (
    <SignIn message={message} />
  );
}