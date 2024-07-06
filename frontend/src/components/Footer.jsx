import React from 'react'
import "./Footer.css"
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';


export default function Footer() {
    return (

        <footer className="text-center text-white mt-5">
            <div className="container p-4">
                <section className="mb-4">
                    <a className="btn btn-outline-light btn-floating m-1" target='_blank' href="//www.linkedin.com/in/alfonso-za" role="button">
                        <FaLinkedinIn />
                    </a>
                    <a className="btn btn-outline-light btn-floating m-1" target='_blank' href="//www.github.com/alfonzeta" role="button">
                        <FaGithub />
                    </a>
                </section>

                <section className="mb-4">

                    <p>
                        Do you have questions, suggestions, or feedback? I'd love to hear from you! Feel free to reach out.
                    </p>
                </section>


            </div>
            <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                © {new Date().getFullYear()} All rights reserved - AppTodoz
            </div>
        </footer>
    );
};