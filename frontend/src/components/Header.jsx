import React from 'react'
import { NavLink } from "react-router-dom"
import logo from "/logo.png"
import { IoSettingsOutline } from "react-icons/io5";
import "./Header.css"

export default function Header() {
  return (
    <nav className='nav-bar'>
      <NavLink to={"/todos"}>{<img width={"60px"} src={logo}></img>}</NavLink>
      <NavLink to={"/settings"}><IoSettingsOutline size={"30px"} color='white' /></NavLink>
    </nav>
  )
}
