"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./about.css";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function About() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutSections() {
      try {
        const { data, error } = await supabase
          .from("about_sections")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;

        setSections(data || []);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    fetchAboutSections();
  }, []);

if (loading) {
    return (
      <div className="about-section">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              {sections.map((section) => (
                <div key={section.id} className="about-subsection">
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>

            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Verified certifications</div>
              </div>
              <div className="stat">
                <div className="stat-number">20+</div>
                <div className="stat-label">Coding Projects Completed</div>
              </div>
            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
