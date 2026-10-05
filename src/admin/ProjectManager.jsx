import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Button } from "@/components/Button";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Lock,
  Link2,
  Github,
  Globe,
  Smartphone,
  Layers,
  Bot,
  Palette,
  Boxes,
  Filter
} from "lucide-react";

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "full-stack":
    case "fullstack":
    case "full stack":
      return Layers;
    case "mobile app":
    case "mobile":
      return Smartphone;
    case "web app":
    case "web":
      return Globe;
    case "ai / ml":
    case "ai":
    case "ml":
      return Bot;
    case "ui/ux design":
    case "ui/ux":
    case "design":
      return Palette;
    default:
      return Boxes;
  }
};

const getCategoryBadgeClass = (category) => {
  switch (category?.toLowerCase()) {
    case "full-stack":
    case "fullstack":
    case "full stack":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "mobile app":
    case "mobile":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "web app":
    case "web":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "ai / ml":
    case "ai":
    case "ml":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "ui/ux design":
    case "ui/ux":
    case "design":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    default:
      return "bg-primary/10 text-primary border border-primary/20";
  }
};

export const ProjectManager = () => {
  const { data, saveItem, saveAll, deleteItem, uploadImage } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [techInput, setTechInput] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [category, setCategory] = useState("Web App");
  const [featuresInput, setFeaturesInput] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");
  const [hasGithub, setHasGithub] = useState(true);
  const [hasDemo, setHasDemo] = useState(true);
  const [githubMessage, setGithubMessage] = useState("");
  const [demoMessage, setDemoMessage] = useState("");

  const resetForm = () => {
    setCurrentItem(null);
    setTitle("");
    setDescription("");
    setImage("");
    setTechInput("");
    setGithub("");
    setDemo("");
    setCategory("Web App");
    setFeaturesInput("");
    setDuration("");
    setOrder("");
    setHasGithub(true);
    setHasDemo(true);
    setGithubMessage("");
    setDemoMessage("");
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    const maxOrder = data.projects.reduce((max, p) => {
      const o = Number(p.order);
      return !isNaN(o) && o > max ? o : max;
    }, 0);
    setOrder(maxOrder + 1);
    setHasGithub(true);
    setHasDemo(true);
    setGithubMessage("");
    setDemoMessage("");
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setImage(item.image || "");
    setTechInput(Array.isArray(item.technologies) ? item.technologies.join(", ") : "");
    setGithub(item.github || "");
    setDemo(item.demo || "");
    setCategory(item.category || "Web App");
    setFeaturesInput(Array.isArray(item.features) ? item.features.join(", ") : "");
    setDuration(item.duration || "");
    setOrder(item.order !== undefined && item.order !== null ? item.order : "");

    // Determine initial toggle state (backward compatible with existing data)
    const initHasGithub = item.hasGithub !== undefined 
      ? Boolean(item.hasGithub) 
      : (item.allowLinks === false ? false : Boolean(item.github && item.github !== "#"));
    const initHasDemo = item.hasDemo !== undefined 
      ? Boolean(item.hasDemo) 
      : (item.allowLinks === false ? false : Boolean(item.demo && item.demo !== "#"));

    setHasGithub(initHasGithub !== false);
    setHasDemo(initHasDemo !== false);
    setGithubMessage(item.githubMessage || "");
    setDemoMessage(item.demoMessage || "");
    setIsEditing(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setImage(res.url);
      if (res.warning) {
        alert(res.warning);
      }
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const featuresArray = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const parsedOrder =
      order !== "" && !isNaN(Number(order))
        ? Number(order)
        : currentItem?.order !== undefined && currentItem?.order !== null && !isNaN(Number(currentItem.order))
        ? Number(currentItem.order)
        : data.projects.length + 1;

    const itemToSave = {
      id: currentItem ? currentItem.id : undefined,
      title,
      description,
      image,
      technologies: techArray,
      github: hasGithub ? github : "",
      demo: hasDemo ? demo : "",
      hasGithub,
      hasDemo,
      githubMessage: !hasGithub
        ? (githubMessage.trim() || "Source code is private under client confidentiality (NDA).")
        : "",
      demoMessage: !hasDemo
        ? (demoMessage.trim() || "Live application is private / restricted internal deployment.")
        : "",
      allowLinks: hasGithub || hasDemo,
      category,
      order: parsedOrder,
      features: featuresArray,
      duration
    };

    const res = await saveItem("projects", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteItem("projects", id);
    }
  };

  // Sort projects according to defined order (1, 2, 3...)
  const sortedProjects = [...data.projects].sort((a, b) => {
    const orderA =
      a.order !== undefined && a.order !== null && a.order !== "" && !isNaN(Number(a.order))
        ? Number(a.order)
        : Infinity;
    const orderB =
      b.order !== undefined && b.order !== null && b.order !== "" && !isNaN(Number(b.order))
        ? Number(b.order)
        : Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.id || 0) - (b.id || 0);
  });

  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedProjects.length) return;

    const newItems = [...sortedProjects];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-assign normalized sequential orders 1, 2, 3...
    const updated = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    await saveAll("projects", updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your featured work</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Project
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in relative">
          <button
            type="button"
            onClick={resetForm}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-xl font-semibold border-b border-border pb-3">
            {currentItem ? "Edit Project" : "New Project"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Project Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fintech Dashboard"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                >
                  <option value="Web App">Web App</option>
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Duration / Year</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Display Order</label>
                  <span className="text-[11px] text-primary/80">#1 appears first on portfolio</span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="e.g. 1, 2, 3..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* GitHub Link Section with its own Toggle */}
              <div className="p-4 rounded-2xl border border-border/80 bg-surface/40 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-semibold">GitHub Repository</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      hasGithub ? "bg-primary/10 text-primary border border-primary/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {hasGithub ? "Enabled" : "Private / NDA"}
                    </span>
                  </div>

                  {/* GitHub Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setHasGithub(!hasGithub)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      hasGithub ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    role="switch"
                    aria-checked={hasGithub}
                    title={hasGithub ? "Turn OFF to mark code as private (Client NDA)" : "Turn ON to enable GitHub link"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        hasGithub ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {hasGithub ? (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-muted-foreground">GitHub URL</label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="e.g. https://github.com/username/project"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none text-sm transition-colors"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-medium text-amber-400">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Code is Confidential / Private (NDA)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      GitHub link is disabled. Visitors will see that this repository is protected under client confidentiality.
                    </p>
                    <input
                      type="text"
                      value={githubMessage}
                      onChange={(e) => setGithubMessage(e.target.value)}
                      placeholder="Optional custom message: e.g. Source code is confidential under client NDA"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface/80 border border-amber-500/30 text-foreground text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* Live Demo Link Section with its own Toggle */}
              <div className="p-4 rounded-2xl border border-border/80 bg-surface/40 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-semibold">Live Demo / App</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      hasDemo ? "bg-primary/10 text-primary border border-primary/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {hasDemo ? "Enabled" : "Private / Internal"}
                    </span>
                  </div>

                  {/* Demo Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setHasDemo(!hasDemo)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      hasDemo ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    role="switch"
                    aria-checked={hasDemo}
                    title={hasDemo ? "Turn OFF to mark demo as private (Internal / NDA)" : "Turn ON to enable demo link"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        hasDemo ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {hasDemo ? (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-muted-foreground">Live Demo URL</label>
                    <input
                      type="text"
                      value={demo}
                      onChange={(e) => setDemo(e.target.value)}
                      placeholder="e.g. https://project.demo.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none text-sm transition-colors"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-medium text-amber-400">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Live Demo is Restricted / Internal</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Demo link is disabled. Visitors will see that the live deployment is internal or private.
                    </p>
                    <input
                      type="text"
                      value={demoMessage}
                      onChange={(e) => setDemoMessage(e.target.value)}
                      placeholder="Optional custom message: e.g. Deployment is internal / client restricted"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface/80 border border-amber-500/30 text-foreground text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Project Image</label>
                <div className="flex gap-4 items-center">
                  {image ? (
                    <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-border bg-muted/20" />
                  ) : (
                    <div className="w-20 h-20 bg-surface border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or enter image URL path"
                      className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-primary/50 focus:outline-none text-sm"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium cursor-pointer transition-colors border border-primary/20">
                      <Upload size={14} />
                      {uploading ? "Uploading..." : "Upload File"}
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Technologies (Tags) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. React, Node.js, Tailwind, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Key Features (comma separated)</label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Real-time updates, AI analytics, Stripe billing"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Project Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the project..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors h-24 resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <Button type="submit">
              {currentItem ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1.5">
              <Filter size={13} className="text-primary" /> Filter by Category:
            </span>
            {["All", "Full-Stack", "Web App", "Mobile App", "AI / ML", "UI/UX Design", "Other"].map((cat) => {
              const count = cat === "All"
                ? sortedProjects.length
                : sortedProjects.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
              if (cat !== "All" && count === 0) return null;
              const CatIcon = cat === "All" ? Boxes : getCategoryIcon(cat);
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                      : "bg-surface/70 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-surface"
                  }`}
                >
                  <CatIcon size={12} className={isActive ? "text-primary-foreground" : "text-primary"} />
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="p-4 md:p-5 font-semibold text-center w-20">Order</th>
                    <th className="p-4 md:p-5 font-semibold">Project</th>
                    <th className="p-4 md:p-5 font-semibold">Category</th>
                    <th className="p-4 md:p-5 font-semibold">Technologies</th>
                    <th className="p-4 md:p-5 font-semibold">Links</th>
                    <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {(() => {
                    const displayedProjects = categoryFilter === "All"
                      ? sortedProjects
                      : sortedProjects.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());

                    if (displayedProjects.length === 0) {
                      return (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-muted-foreground">
                            {sortedProjects.length === 0 
                              ? "No projects found. Add your first project above." 
                              : `No projects found under "${categoryFilter}" category.`}
                          </td>
                        </tr>
                      );
                    }

                    return displayedProjects.map((project) => {
                      const globalIndex = sortedProjects.findIndex(p => p.id === project.id);
                      const CatIcon = getCategoryIcon(project.category);

                      return (
                        <tr key={project.id} className="hover:bg-surface/20 transition-colors">
                          <td className="p-4 md:p-5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                                #{project.order !== undefined && project.order !== null && project.order !== "" ? project.order : globalIndex + 1}
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleMove(globalIndex, "up")}
                                  disabled={globalIndex <= 0}
                                  className="p-0.5 rounded hover:bg-surface text-muted-foreground hover:text-primary disabled:opacity-20 disabled:hover:text-muted-foreground transition-all cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Up"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMove(globalIndex, "down")}
                                  disabled={globalIndex === sortedProjects.length - 1}
                                  className="p-0.5 rounded hover:bg-surface text-muted-foreground hover:text-primary disabled:opacity-20 disabled:hover:text-muted-foreground transition-all cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Down"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 md:p-5 flex items-center gap-4">
                            {project.image ? (
                              <img src={project.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-border/30 bg-muted/10 flex-shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                No Img
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-foreground text-sm md:text-base">{project.title}</div>
                              <div className="text-xs text-muted-foreground">{project.duration}</div>
                            </div>
                          </td>
                          <td className="p-4 md:p-5 text-sm">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(project.category)}`}>
                              <CatIcon className="w-3.5 h-3.5 flex-shrink-0" />
                              {project.category || "Web App"}
                            </span>
                          </td>
                      <td className="p-4 md:p-5">
                        <div className="flex flex-wrap gap-1 max-w-[200px] md:max-w-xs">
                          {Array.isArray(project.technologies)
                            ? project.technologies.slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-[10px] bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded-full">
                                  {tech}
                                </span>
                              ))
                            : null}
                          {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                            <span className="text-[10px] text-muted-foreground px-1">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        <div className="flex flex-col gap-1.5">
                          {/* GitHub Link Status */}
                          {project.hasGithub === false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                              <Lock size={11} /> GitHub: Private
                            </span>
                          ) : project.github && project.github !== "#" ? (
                            <a href={project.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-xs">
                              <Github size={11} /> GitHub <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">GitHub: None</span>
                          )}

                          {/* Demo Link Status */}
                          {project.hasDemo === false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                              <Lock size={11} /> Demo: Private
                            </span>
                          ) : project.demo && project.demo !== "#" ? (
                            <a href={project.demo} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-xs">
                              <ExternalLink size={11} /> Live Demo
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">Demo: None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(project)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
