import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUp.css"
import { signUp_URL } from '../storage/storage';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const emptyInputs = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowMessage(true);
        setSuccessMessage("Loading...")
        const newUser = {
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            timestamp: new Date()
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        };
        fetch(signUp_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setSuccessMessage('Verification e-mail has been sent!');
                    setErrorMessage('');
                    emptyInputs();
                } else {
                    setShowMessage(true);
                    setErrorMessage(data.errors);
                }
            })
            .catch(error => {
                console.log(error);
                setShowMessage(true);
                setErrorMessage(['Ha ocurrido un error, inténtalo de más tarde']);
            });
    };

    return (
        <div className='sign-up-parent'>
            <div className='sign-up-child'>
                <div>
                    <video loop={true} muted={true} autoPlay={true} playsInline={true} type="video/mp4" src="/video2.mp4">sef</video>
                </div>
                <div className='sign-up-form-parent'>
                    <form className='sign-up-form' onSubmit={handleSubmit} action="">
                        <input value={username} required onChange={(e) => { setUsername(e.target.value); setShowMessage(false); }} type="text" placeholder='username' />
                        <input value={password} required onChange={(e) => { setPassword(e.target.value); setShowMessage(false); }} type="password" placeholder='password' />
                        <input value={email} onChange={(e) => { setEmail(e.target.value); setShowMessage(false); }} type="text" placeholder='email' />
                        <input value={firstName} required onChange={(e) => { setFirstName(e.target.value); setShowMessage(false); }} type="text" placeholder='name' />
                        <input value={lastName} required onChange={(e) => { setLastName(e.target.value); setShowMessage(false); }} type="text" placeholder='last name' />
                        <input type="submit" value="Sign up" />
                    </form>
                    {showMessage &&
                        <ul className='error-message'>
                            {errorMessage
                                ? errorMessage.map((msg => (
                                    <li>{msg.msg || msg}</li>
                                )))
                                : <p>{successMessage}</p>
                            }
                        </ul>
                    }
                    <p>Already have an account? <a href="signup" onClick={handleSignUp}>Sign in!</a></p>
                </div>
            </div>
        </div>
    );
}
