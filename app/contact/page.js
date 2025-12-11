"use client";
import "./contact.css";
import { useState } from "react";
import { supabase } from "@/lib/supabase"
import { BsEnvelopeAtFill } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";

export default function Contact() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email:"",
        message: ""
    });
    const [status, setStatus] = useState("")

    const handleInputChange = (e) => {
        const {name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault()

    // Insert into Supabase
    const { error } = await supabase
      .from("contacts")
      .insert([formData])

    if (error) {
      setStatus("Something went wrong, please try again.")
    } else {
      setStatus(" Message sent successfully!")
      setFormData({ name: "", email: "", message: "" })
      setIsModalOpen(false)
    }
  }

   const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ name: "", email: "", message: "" })
  }

    return (
       <>
            <div className="contact-container">
                <div className="contact-wrapper">
                    <h2 className="section-title">Let's Work Together</h2>

                    <div className="contact-content-centered">
                        <div className="contact-info-centered">
                            <h3>Ready to start a project?</h3>
                            <p>
                                I'm always interested in new opportunities and interesting projects.
                                It can be one time projects, events, posters, websites or apps. I'm just a call or text away from getting on it.
                            </p>
                            <p>Let's discuss how we can work together!</p>

                            <div className="contact-methods-centered">
                                <div className="contact-method">
                                    <span className="contact-icon-tick"><BsCheckCircleFill /></span>
                                    <span>Available for freelance work</span>
                                </div>
                            </div>
                            {/* Google Maps Section */}
                        <div className="map-container" style={{
                            width: '100%',
                            height: '300px',
                            margin: '2rem 0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=Krugersdorp,Gauteng,South+Africa&zoom=13`}>
                            </iframe>
                        </div>

                            <button
                                className="contact-btn"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Get In Touch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* contact Modal*/}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Send me a message </h3>
                            <button className="close-btn" onClick={closeModal}>x</button>
                        </div>

                        <div className="modal-form">
                            <div className="form-group">
                                <label className="modal-label" htmlFor="name">Enter Your Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Steve, Bruce"
                                    value={formData.name}
                                    onChange={handleInputChange} required
                                />
                            </div>

                            <div className="form-group">
                                <label className="modal-label" htmlFor="email">Enter Your Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="e.g. Steve@gmail.com"
                                    value={formData.email}
                                    onChange={handleInputChange} required
                                />
                            </div>

                            <div className="form-group">
                                <label className="modal-label" htmlFor="message">Type in your message</label>
                                <textarea
                                    id="message"

                                    name="message"
                                    placeholder="Hi, i have a website i would like to create..."
                                    value={formData.message}
                                    onChange={handleInputChange} required
                               ></textarea>
                            </div>
                            <button type="button" className="submit-btn" onClick={handleSubmit}>
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
