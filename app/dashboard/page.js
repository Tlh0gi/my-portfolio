"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certificates: 0,
    messages: 0,
  });
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    tech_stack: "",
    status: ""
  });

  // Authentication check
  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    if (auth !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, certificatesRes, messagesRes] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("web_skills").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("", { count: "exact", head: false }),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        skills: skillsRes.count || 0,
        certificates: certificatesRes.count || 0,
        messages: messagesRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || "",
        video_url: project.video_url || "",
        tech_stack: Array.isArray(project.tech_stack)
          ? project.tech_stack.join(", ")
          : "",
        status: project.status || ""
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        video_url: "",
        tech_stack: "",
        status: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      video_url: "",
      tech_stack: "",
      status: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      tech_stack: formData.tech_stack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        alert("Project updated successfully!");
      } else {
        // Create new project
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);

        if (error) throw error;
        alert("Project created successfully!");
      }

      closeModal();
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      alert("Project deleted successfully!");
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const managementCards = [
    {
      title: "About Sections",
      description: "Manage your about me content and personal information",
      icon: "👤",
      link: "/dashboard/about",
      stats: "5 sections",
      color: "from-cyan-500 to-blue-500"
    },

    {
      title: "Projects",
      description: "Showcase your portfolio projects",
      icon: "💼",
      link: "/dashboard/projects",
      stats: `${stats.projects} projects`,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const quickStats = [
    {
      label: "Projects",
      value: stats.projects.toString(),
      change: stats.projects > 0 ? `${stats.projects} total` : "No projects yet",
      trend: "up",
      icon: "💼"
    },
    {
      label: "Skills",
      value: stats.skills.toString(),
      change: stats.skills > 0 ? `${stats.skills} total` : "No skills yet",
      trend: "up",
      icon: "⚡"
    },
    {
      label: "Messages",
      value: stats.messages.toString(),
      change: stats.messages > 0 ? `${stats.messages} messages` : "No messages",
      trend: stats.messages > 0 ? "up" : "neutral",
      icon: "📧"
    },
    {
      label: "Certificates",
      value: stats.certificates.toString(),
      change: stats.certificates > 0 ? `${stats.certificates} earned` : "No certificates",
      trend: "up",
      icon: "🏆"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <i className="fa-solid fa-inbox"></i> Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, manage your portfolio content
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
              >
                View Portfolio
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats - Now 4 cards instead of 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-3xl">{stat.icon}</div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Content Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementCards.map((card, index) => (
              <Link
                key={index}
                href={card.link}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {card.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {card.stats}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center text-cyan-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Manage
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}

      </main>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tech_stack"
                    value={formData.tech_stack}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Completed, In Progress, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
