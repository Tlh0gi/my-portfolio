"use client";
import React from "react"


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
    <>
        <footer className="footer">
            <div className="footer-divider" />

            <div className="footer-content">
                <div className="footer-copyright">
                    <p>&copy; {currentYear} Letlhogonolo Maoka. All rights reserved.</p>
                </div>

                <div className="footer-socials">
                    <a className="footer-link" href="https://github.com/Tlh0gi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fa-brands fa-github"></i>
                    </a>

                    <a href="#" className="footer-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </footer>
    </>
    );
}
