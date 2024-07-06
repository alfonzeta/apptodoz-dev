import React from "react";
import "./ProfileImage.css"

const ProfileImage = ({ name, lastName, todo }) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const firstNameInitial = name[0].toUpperCase()
    const lastNameInitial = lastName[0].toUpperCase()


    const chooseBackground = () => {


        if (user.firstName === name) {
            return "blue";
        } if (todo.author.firstName === name) {
            return "green"

        } else {
            return "red"

        }

    }


    return (
        <span style={{ background: chooseBackground(), cursor: "default" }} className="user-profile-image">
            {firstNameInitial}
            {lastNameInitial}
        </span >
    )

}
export default ProfileImage;