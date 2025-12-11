"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AboutPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    section_key: "",
    title: "",
    content: "",
    display_order: ""
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

  // Fetch sections when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSections();
    }
  }, [isAuthenticated]);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/about-sections');
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setSections(result.data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      alert("Error loading sections: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        section_key: section.section_key,
        title: section.title,
        content: section.content || "",
        display_order: section.display_order || ""
      });
    } else {
      setEditingSection(null);
      setFormData({
        section_key: "",
        title: "",
        content: "",
        display_order: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({
      section_key: "",
      title: "",
      content: "",
      display_order: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const sectionData = {
      section_key: formData.section_key,
      title: formData.title,
      content: formData.content,
      display_order: formData.display_order ? parseInt(formData.display_order) : null
    };

    try {
      let response;

      if (editingSection) {
        // Update existing section
        response = await fetch('/api/about-sections', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingSection.id,
            ...sectionData
          }),
        });
      } else {
        // Create new section
        response = await fetch('/api/about-sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sectionData),
        });
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      alert(editingSection ? "Section updated successfully!" : "Section created successfully!");
      closeModal();
      fetchSections();
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Error saving section: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/about-sections?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      alert("Section deleted successfully!");
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Error deleting section: " + error.message);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  📝 About Section Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your about page sections and content
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              disabled={isLoading}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              + Add Section
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && sections.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first about section</p>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition"
            >
              Create Your First Section
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  {/* Section Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  </div>

                  {/* Section Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {section.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {section.section_key}
                        </span>
                        {section.display_order && (
                          <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Order: {section.display_order}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(section)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                      {section.content || "No content provided"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSection ? "Edit Section" : "Add New Section"}
              </h3>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Key * (e.g., journey, passion, exploring)
                  </label>
                  <input
                    type="text"
                    name="section_key"
                    value={formData.section_key}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                    placeholder="journey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                    placeholder="My Journey into Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Write your section content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order (Optional)
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="1"
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                    placeholder="1"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Controls the order in which sections appear on your about page
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : (editingSection ? "Update Section" : "Create Section")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
