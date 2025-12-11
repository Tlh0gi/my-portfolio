"use client";
import React from "react"
import { usePathname } from 'next/navigation';
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';

export default function Header() {
     const [isMenuOpen, setIsMenuOpen] = React.useState(false);
      const pathname = usePathname();

      //check if a link is active
      const isActive = (href) => {
        if (href === '/') {
          return pathname === '/';
        }
        return pathname.startsWith(href);
      };

    return(
    <>
            <nav className="mainNav">
                <h1 className="title">Portfolio</h1>

                <ul className="nav-options">
                    <li className={isActive('/') ? 'active' : ''}>
                        <a className="alt-style" href="/">
                            <IoHomeOutline className="nav-icon" />
                            <span>Home</span>
                        </a>
                    </li>
                    <li className={isActive('/skills') ? 'active' : ''}>
                        <a className="alt-style" href="/skills">
                            <MdOutlineWorkOutline className="nav-icon" />
                            <span>Skills</span>
                        </a>
                    </li>
                    <li className={isActive('/about') ? 'active' : ''}>
                        <a className="alt-style" href="/about">
                            <BsPersonCircle className="nav-icon" />
                            <span>About</span>
                        </a>
                    </li>
                    <li className={isActive('/contact') ? 'active' : ''}>
                        <a className="alt-style" href="/contact">
                            <AiOutlineMail className="nav-icon" />
                            <span>Contact</span>
                        </a>
                    </li>
                </ul>

                {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
            </nav>
        </>
    );
  }

