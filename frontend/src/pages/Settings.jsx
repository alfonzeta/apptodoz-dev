import React, { useState } from 'react'
import Header from '../components/Header'
import "./Settings.css"
import AccountSettings from '../components/AccountSettings/AccountSettings'
import SocialSettings from '../components/AccountSettings/SocialSettings'
import Footer from '../components/Footer'

export default function Settings() {

  const [showAccount, setShowAccount] = useState(true)
  const [showSocial, setShowSocial] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))



  return (
    <>
      <Header />
      <div className='settings-container'>
        <h3>{`Welcome to your settings dashboard, ${user.firstName}`}</h3>
        <div className='account-social-buttons'>
          <button className={showAccount ? "active-button" : undefined} onClick={() => { setShowAccount(true); setShowSocial(false) }} >Account</button>
          <button className={showSocial ? "active-button" : undefined} onClick={() => { setShowSocial(true); setShowAccount(false) }} >Social</button>
        </div>
        {showAccount
          ? <AccountSettings />
          : <SocialSettings />
        }
      </div>

      <Footer />
    </>
  )
}
