import { createContext, useContext, useState, useEffect } from "react";

// Statically imported initial JSON data as baseline defaults
import initialProjects from "@/data/projects.json";
import initialExperience from "@/data/experience.json";
import initialSkills from "@/data/skills.json";
import initialEducation from "@/data/education.json";
import initialCertifications from "@/data/certifications.json";
import initialAchievements from "@/data/achievements.json";
import initialSettings from "@/data/settings.json";

const PortfolioDataContext = createContext();

export const usePortfolio = () => useContext(PortfolioDataContext);

export const PortfolioDataProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    experience: [],
    skills: [],
    education: [],
    certifications: [],
    achievements: []
  });
  const [visibility, setVisibility] = useState({
    about: true,
    projects: true,
    experience: true,
    skills: true,
    education: true,
    certifications: true,
    achievements: true,
    testimonials: true
  });
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Load data from filesystem API, localStorage, or compiled defaults
  const loadSection = async (section, defaultData) => {
    // 1. Check localStorage for user overrides (useful for previewing in deployed mode)
    const local = localStorage.getItem(`portfolio_local_${section}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(`Failed to parse local storage data for ${section}`);
      }
    }

    // 2. Fetch from Vite Dev Server API if running
    try {
      const response = await fetch(`/api/data/${section}`);
      if (response.ok) {
        const fetched = await response.json();
        // Allow objects (like settings) or arrays
        if (fetched && (Array.isArray(fetched) || typeof fetched === "object")) {
          return fetched;
        }
      }
    } catch (e) {
      // Dev API not running (deployed on Vercel/Netlify)
      setIsReadOnly(true);
    }

    // 3. Fallback to imported static defaults
    return defaultData;
  };

  const loadAllData = async () => {
    setLoading(true);
    const projects = await loadSection("projects", initialProjects);
    const experience = await loadSection("experience", initialExperience);
    const skills = await loadSection("skills", initialSkills);
    const education = await loadSection("education", initialEducation);
    const certifications = await loadSection("certifications", initialCertifications);
    const achievements = await loadSection("achievements", initialAchievements);
    const settings = await loadSection("settings", initialSettings);

    setData({
      projects: Array.isArray(projects) ? projects : [],
      experience: Array.isArray(experience) ? experience : [],
      skills: Array.isArray(skills) ? skills : [],
      education: Array.isArray(education) ? education : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      achievements: Array.isArray(achievements) ? achievements : []
    });

    if (settings && settings.visibility) {
      setVisibility({
        ...initialSettings.visibility,
        ...settings.visibility
      });
    }

    setLoading(false);
  };


  useEffect(() => {
    loadAllData();

    // Listen for storage events from other tabs to sync CMS changes in real-time
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("portfolio_local_")) {
        loadAllData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update or Insert an item in a section
  const saveItem = async (section, item) => {
    const sectionData = [...data[section]];
    const index = sectionData.findIndex((i) => i.id === item.id);

    if (index > -1) {
      sectionData[index] = item;
    } else {
      // New item, generate id
      const newId = sectionData.reduce((max, i) => (i.id > max ? i.id : max), 0) + 1;
      item.id = newId;
      sectionData.push(item);
    }

    return await persistData(section, sectionData);
  };

  // Delete an item from a section
  const deleteItem = async (section, id) => {
    const sectionData = data[section].filter((i) => i.id !== id);
    return await persistData(section, sectionData);
  };

  // Save entire updated array for a section (useful for reordering)
  const saveAll = async (section, updatedData) => {
    return await persistData(section, updatedData);
  };

  // Persist the updated section data
  const persistData = async (section, updatedData) => {
    // Update local React state first
    setData((prev) => ({
      ...prev,
      [section]: updatedData
    }));

    // Save to localStorage as preview backup
    localStorage.setItem(`portfolio_local_${section}`, JSON.stringify(updatedData));

    // Try to write to disk using the custom Vite server API
    try {
      const response = await fetch(`/api/data/${section}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData, null, 2)
      });

      if (response.ok) {
        return { success: true, persisted: "disk" };
      } else {
        return { success: true, persisted: "local", warning: "Running in read-only mode. Changes saved locally to browser. Please download JSON file to persist." };
      }
    } catch (e) {
      return { success: true, persisted: "local", warning: "Running in read-only mode. Changes saved locally to browser. Please download JSON file to persist." };
    }
  };

  // Upload image: returns image URL path
  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              filename: file.name,
              base64: base64
            })
          });

          if (response.ok) {
            const result = await response.json();
            resolve({ success: true, url: result.url });
          } else {
            // Local storage fallback for base64 images in production preview
            resolve({ success: true, url: base64, warning: "Production Preview Mode: Image stored in browser memory only." });
          }
        } catch (e) {
          resolve({ success: true, url: base64, warning: "Production Preview Mode: Image stored in browser memory only." });
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Toggle a section's visibility
  const toggleVisibility = async (section) => {
    const updatedVisibility = {
      ...visibility,
      [section]: !visibility[section]
    };

    setVisibility(updatedVisibility);

    const settingsObject = { visibility: updatedVisibility };
    localStorage.setItem("portfolio_local_settings", JSON.stringify(settingsObject));

    try {
      await fetch(`/api/data/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settingsObject, null, 2)
      });
    } catch (e) {
      console.warn("Dev API not available for settings save", e);
    }
  };

  // Download section as JSON file
  const downloadJson = (section) => {
    const sectionData = section === "settings" ? { visibility } : data[section];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sectionData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${section}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear local storage and restore default bundled JSON data
  const resetToDefault = (section) => {
    localStorage.removeItem(`portfolio_local_${section}`);
    loadAllData();
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        visibility,
        loading,
        isReadOnly,
        saveItem,
        saveAll,
        deleteItem,
        uploadImage,
        downloadJson,
        resetToDefault,
        toggleVisibility,
        refreshData: loadAllData
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};
