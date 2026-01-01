"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import "./Homepage.css";



export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false);
    const [heroContent, setHeroContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    //fetch data from supabase
    useEffect(() => {
        async function fetchHeroContent() {
            try {
                // Check if Supabase client exists
                if (!supabase) {
                    throw new Error('Supabase client not initialized. Check environment variables.');
                }

                const { data, error } = await supabase
                    .from('hero_content')
                    .select('*')
                    .eq('section', 'hero')
                    .single()

                if (error) {
                    throw error;
                }

                if (!data) {
                    throw new Error('No hero content found in database');
                }

                setHeroContent(data);
            } catch(error) {
                setError(error.message || 'Failed to fetch content');
            } finally {
                setLoading(false);
            }
        }
        fetchHeroContent();
    }, []);

    //set the loading
    useEffect(() => {
        if(!loading) {
            setIsVisible(true);
        }
    }, [loading]);

   

   
    if (loading) {
        return (
            <div className="homepage">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }


    if (!heroContent) {
        return (
            <div className="homepage">
                <div className="error-container">
                    <p>No content found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`homepage ${isVisible ? 'fade-in' : ''}`}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="highlight">{heroContent.title}</span>
                        </h1>
                        <p className="hero-subtitle">{heroContent.subtitle}</p>
                        <p className="hero-description">
                            {heroContent.description}
                        </p>
                        <div className="hero-buttons">
                            <a href="skills">
                                <button className="cta-primary">{heroContent.primary_button}</button>
                            </a>
                            <a href="contact">
                            <button
                                className="cta-secondary">
                                Get In Touch
                            </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
