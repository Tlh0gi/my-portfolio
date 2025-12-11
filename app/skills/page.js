"use client";
import {useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import "./skills.css"


export default function Skills() {
        const [isVisible, setIsVisible] = useState(false);
        const [certificates, setCertificates] = useState([]);
        const [projects, setProjects ] = useState([]);
        const [skills, setSkills] = useState([]);

    // Fetch skills from Supabase
        useEffect(() => {
            async function loadSkills() {
                const { data, error } = await supabase
                    .from("web_skills")
                    .select("*")
                    .order("created_at", { ascending: true });

                if (error) {
                    return;
                }

                setSkills(data || []);
            }

            loadSkills();
        }, []);


        useEffect(() => {
            setIsVisible(true);
                    const script = document.createElement("script");
        script.src = "//cdn.credly.com/assets/utilities/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    // Fetch certificates from Supabase
    useEffect(() => {
        async function loadCertificates() {
            const { data, error } = await supabase
                .from("certificates")
                .select("*")

            if (error) {
                return;
            }

            setCertificates(data || []);
        }

        loadCertificates();
    }, []);

    useEffect(() => {
    // Only run when certificates are loaded into DOM
    if (certificates.length === 0) return;

    // If Credly script is already loaded, process badges
    if (window.__CredlyTools) {
        window.__CredlyTools.process();
    } else {
        // Reload script if needed
        const script = document.createElement("script");
        script.src = "//cdn.credly.com/assets/utilities/embed.js";
        script.async = true;
        script.onload = () => window.__CredlyTools?.process();
        document.body.appendChild(script);
    }
}, [certificates]);


    //projects
    useEffect(() => {
        async function loadProjects() {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                return;
            }

            setProjects(data);
        }

        loadProjects();
    }, []);



        return (
            <section className="skills-section">
                <div className="container">
                    <h2 className="section-title">Skills</h2>
                    <p className="skill-description">As new frameworks are being developed please note the following will skills will increase and improve.</p>
                    <div className="skills-grid">
                        {skills.map((skill, index) => (
                            <div key={skill.id} className="skill-item">
                                <div className="skill-content">
                                    <img
                                        src={skill.logo}
                                        alt={`${skill.skill} logo`}
                                        className="skill-logo"
                                    />
                                    <span className="skill-name">{skill.skill}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container">
                     <h2 className="section-title mt-16">Certificates</h2>
                <p className="skill-description">Verified badges issued via Credly.</p>

                <div
                    id="credly-badges"
                    className="skills-grid"
                    >
                    {certificates.map(cert => (
                        <div
                            key={cert.cert_id}
                            data-iframe-width="150"
                            data-iframe-height="270"
                            data-share-badge-id={cert.cert_id}
                            data-share-badge-host="https://www.credly.com"
                        />
                    ))}
                    </div>
                </div>




                <div className="container">
                    <h2 className="section-title">Featured Projects</h2>
                    <div className="projects-grid">
                        {projects.map((project, index) => (
                            <div key={index} className="project-card">
                                 <div className="project-header">
                                    <h3 className="project-title">{project.title}</h3>
                                    <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                                        {project.status}
                                    </span>
                            </div>
                             <p className="project-description">{project.description}</p>
                             <div className="project-status">
                                {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.map((tech, techIndex) => (
                                    <span key={techIndex} className="tech-tag">{tech}</span>
                                ))}
                                </div>
                                {project.video_url && (
                                    <video
                                    src={project.video_url}
                                    controls
                                    width="400"
                                    height="180"
                                    preload="metadata"
                                    >
                                    Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="project-actions">

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
}
