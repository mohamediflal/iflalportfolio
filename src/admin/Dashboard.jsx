import { useState, useEffect, Component } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { ProjectManager } from "./ProjectManager";
import { ExperienceManager } from "./ExperienceManager";
import { SkillManager } from "./SkillManager";
import { EducationManager } from "./EducationManager";
import { CertificationManager } from "./CertificationManager";
import { AchievementManager } from "./AchievementManager";
import { Settings } from "./Settings";

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Admin section rendering error:", error, errorInfo);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass p-8 rounded-3xl border border-red-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h3 className="text-xl font-bold text-foreground">Error Loading Section</h3>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message || "An unexpected error occurred while rendering this section."}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  GraduationCap,
  Award,
  AwardIcon,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  PlusCircle,
  FileJson,
  Menu,
  X
} from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, isReadOnly, visibility, toggleVisibility } = usePortfolio();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Auth Guard
    const auth = localStorage.getItem("portfolio_admin_auth");
    if (auth !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Sync active tab with URL path (/admin/projects -> "projects")
    const subRoute = location.pathname.replace(/^\/admin\/?/, "").split("/")[0]?.toLowerCase();
    const validTabs = ["dashboard", "projects", "experience", "skills", "education", "certifications", "achievements", "settings"];
    if (subRoute && validTabs.includes(subRoute)) {
      setActiveTab(subRoute);
    } else {
      setActiveTab("dashboard");
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
    navigate(tabId === "dashboard" ? "/admin" : `/admin/${tabId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_auth");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading CMS configuration...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalProjects = data.projects.length;
  const totalExperience = data.experience.length;
  const totalSkills = data.skills.length;
  const totalEducation = data.education.length;
  const totalCertifications = data.certifications.length;
  const totalAchievements = data.achievements.length;

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: AwardIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleQuickAddClick = (tabId) => {
    handleTabChange(tabId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 glass-strong border-r border-border/80 flex flex-col z-40 transform transition-transform duration-300 md:translate-x-0 md:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            Admin<span className="text-primary">Panel</span>
          </div>
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleTabChange(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === link.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-all font-medium"
          >
            <ExternalLink size={14} />
            View Live Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer font-medium"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header toolbar */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between md:justify-end gap-4 glass z-30">
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1.5 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {isReadOnly ? "Deployed Preview Mode" : "Local Disk Connection"}
            </span>
            <div className="h-4 w-px bg-border hidden md:block" />
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold">Owner Admin</div>
              <div className="text-[10px] text-muted-foreground">iflalportfolio@admin.com</div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Welcome banner */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, Mohamed Iflal!</h1>
                <p className="text-sm text-muted-foreground mt-1">Here is a snapshot of your current dynamic portfolio content status</p>
              </div>

              {/* Statistics Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: "Projects", count: totalProjects, icon: Briefcase, color: "text-blue-400" },
                  { label: "Experience", count: totalExperience, icon: Briefcase, color: "text-purple-400" },
                  { label: "Skills", count: totalSkills, icon: Wrench, color: "text-primary" },
                  { label: "Education", count: totalEducation, icon: GraduationCap, color: "text-yellow-400" },
                  { label: "Certifications", count: totalCertifications, icon: Award, color: "text-teal-400" },
                  { label: "Achievements", count: totalAchievements, icon: AwardIcon, color: "text-pink-400" }
                ].map((stat, idx) => (
                  <div key={idx} className="glass p-5 rounded-2xl border border-border/50 flex flex-col justify-between h-28 hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-start text-muted-foreground">
                      <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-3xl font-bold">{stat.count}</span>
                  </div>
                ))}
              </div>

              {/* Portfolio Sections Management */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-border/60 pb-2 flex items-center gap-2">
                  <LayoutDashboard className="text-primary w-5 h-5" /> Portfolio Sections Management
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-4">
                  {[
                    { key: "about", label: "About" },
                    { key: "projects", label: "Projects" },
                    { key: "experience", label: "Experience" },
                    { key: "skills", label: "Skills" },
                    { key: "education", label: "Education" },
                    { key: "certifications", label: "Certificates" },
                    { key: "achievements", label: "Achievements" },
                    { key: "testimonials", label: "Testimonials" }
                  ].map((sec) => {
                    const isVisible = visibility[sec.key];
                    return (
                      <button
                        key={sec.key}
                        onClick={() => toggleVisibility(sec.key)}
                        className={`glass p-4 rounded-2xl border text-center transition-all cursor-pointer select-none flex flex-col items-center justify-between gap-3 min-h-[96px] ${
                          isVisible 
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                            : "border-border/40 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider">{sec.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full inline-block ${isVisible ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                          <span className={`text-[10px] font-bold tracking-wider ${isVisible ? "text-primary" : "text-muted-foreground"}`}>
                            {isVisible ? "ACTIVE" : "HIDDEN"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Add Content Grid */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-border/60 pb-2 flex items-center gap-2">
                  <PlusCircle className="text-primary w-5 h-5" /> Quick Add Content
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Add Project", desc: "Showcase new featured works or web apps", tab: "projects" },
                    { title: "Add Experience", desc: "Log a career growth milestone or developer role", tab: "experience" },
                    { title: "Add Skills", desc: "List updated languages, tools or designs", tab: "skills" },
                    { title: "Add Education", desc: "Update your degrees or academic timeline", tab: "education" },
                    { title: "Add Certifications", desc: "List a course badge, certificate, or credential", tab: "certifications" },
                    { title: "Add Achievements", desc: "Add won hackathons, awards, or honors", tab: "achievements" }
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAddClick(card.tab)}
                      className="glass text-left p-6 rounded-2xl hover:border-primary/50 transition-all border border-border/40 cursor-pointer group flex flex-col justify-between min-h-[120px]"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{card.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase inline-flex items-center gap-1 mt-3">
                        Go to manager &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data and System info info */}
              <div className="glass p-6 rounded-3xl border border-border/50 space-y-4 max-w-2xl">
                <h3 className="font-semibold flex items-center gap-2 text-foreground text-sm">
                  <FileJson className="text-primary w-4 h-4" /> System Core and Storage Info
                </h3>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    All content loaded into this developer portfolio is read dynamically from JSON files inside the project (`src/data/*.json`).
                  </p>
                  <p>
                    When running on local dev server (`npm run dev`), modifications are saved directly to these files. Once saved, simply run standard commands to build and commit to git:
                  </p>
                  <pre className="p-3 bg-surface rounded-lg border border-border overflow-x-auto text-[10px] text-primary/80 font-mono">
                    git add src/data/{"\n"}git commit -m "update portfolio CMS content"{"\n"}git push
                  </pre>
                  <p>
                    This triggers automatic CD redeployment on Vercel, Netlify, or GitHub Pages.
                  </p>
                </div>
              </div>
            </div>
          )}

          <AdminErrorBoundary activeTab={activeTab} onReset={() => handleTabChange("dashboard")}>
            {activeTab === "projects" && <ProjectManager />}
            {activeTab === "experience" && <ExperienceManager />}
            {activeTab === "skills" && <SkillManager />}
            {activeTab === "education" && <EducationManager />}
            {activeTab === "certifications" && <CertificationManager />}
            {activeTab === "achievements" && <AchievementManager />}
            {activeTab === "settings" && <Settings />}
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
};
