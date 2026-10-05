import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/Button";

export const ExperienceManager = () => {
  const { data, saveItem, deleteItem, uploadImage } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [company, setCompany] = useState("");
  const [logo, setLogo] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [current, setCurrent] = useState(false);

  const resetForm = () => {
    setCurrentItem(null);
    setCompany("");
    setLogo("");
    setRole("");
    setPeriod("");
    setStartDate("");
    setEndDate("");
    setEmploymentType("Full-time");
    setDescription("");
    setResponsibilitiesInput("");
    setTechInput("");
    setCurrent(false);
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setCompany(item.company || "");
    setLogo(item.logo || "");
    setRole(item.role || "");
    setPeriod(item.period || "");
    setStartDate(item.startDate || "");
    setEndDate(item.endDate || "");
    setEmploymentType(item.employmentType || "Full-time");
    setDescription(item.description || "");
    setResponsibilitiesInput(Array.isArray(item.responsibilities) ? item.responsibilities.join("\n") : "");
    setTechInput(Array.isArray(item.technologies) ? item.technologies.join(", ") : "");
    setCurrent(!!item.current);
    setIsEditing(true);
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setLogo(res.url);
      if (res.warning) {
        alert(res.warning);
      }
    } catch (err) {
      alert("Failed to upload logo: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responsibilitiesArray = responsibilitiesInput
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Format period e.g. "November 2025 — Present"
    let formattedPeriod = period;
    if (!formattedPeriod) {
      const start = startDate ? new Date(startDate).toLocaleString("default", { month: "long", year: "numeric" }) : "";
      const end = current ? "Present" : (endDate ? new Date(endDate).toLocaleString("default", { month: "long", year: "numeric" }) : "");
      formattedPeriod = `${start} — ${end}`;
    }

    const itemToSave = {
      id: currentItem ? currentItem.id : undefined,
      company,
      logo,
      role,
      period: formattedPeriod,
      startDate,
      endDate: current ? "Present" : endDate,
      employmentType,
      description,
      responsibilities: responsibilitiesArray,
      technologies: techArray,
      current
    };

    const res = await saveItem("experience", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      await deleteItem("experience", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Experience</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your professional career journey</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Experience
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
            {currentItem ? "Edit Experience" : "New Experience"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. GrowDigitec"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Job Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Job Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Mobile App Developer"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <input
                    type="month"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <input
                    type="month"
                    disabled={current}
                    required={!current}
                    value={current ? "" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors text-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Current Job Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer text-primary focus:ring-primary focus:ring-offset-background bg-surface"
                />
                <label htmlFor="current" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                  I currently work here
                </label>
              </div>

              {/* Explicit period string override */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Period Override (Optional)</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g. November 2025 — Present"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Company Logo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Company Logo</label>
                <div className="flex gap-4 items-center">
                  {logo ? (
                    <img src={logo} alt="Preview" className="w-16 h-16 object-contain rounded-xl border border-border bg-white p-1 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-surface border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-[10px] flex-shrink-0">
                      No Logo
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="Or enter logo URL"
                      className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-primary/50 focus:outline-none text-sm"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium cursor-pointer transition-colors border border-primary/20">
                      <Upload size={14} />
                      {uploading ? "Uploading..." : "Upload Logo"}
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. Flutter, Laravel, Dart, REST APIs"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Responsibilities (one per line)</label>
                <textarea
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Collaborated with teams to implement REST APIs&#10;Optimized database index loads&#10;Managed app releases to Play Store"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors h-28 resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Job Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your role and impact at the company..."
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
              {currentItem ? "Save Changes" : "Create Experience"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Company & Role</th>
                  <th className="p-4 md:p-5 font-semibold">Period</th>
                  <th className="p-4 md:p-5 font-semibold">Type</th>
                  <th className="p-4 md:p-5 font-semibold">Technologies</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.experience.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                      No experiences found. Add your career milestones above.
                    </td>
                  </tr>
                ) : (
                  data.experience.map((exp) => (
                    <tr key={exp.id} className="hover:bg-surface/20 transition-colors">
                      <td className="p-4 md:p-5 flex items-center gap-4">
                        {exp.logo ? (
                          <img src={exp.logo} alt="" className="w-10 h-10 object-contain rounded-lg border border-border/30 bg-white p-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] text-muted-foreground flex-shrink-0 font-bold uppercase">
                            {exp.company ? exp.company.slice(0, 2) : "EX"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-foreground text-sm md:text-base">{exp.role}</div>
                          <div className="text-xs text-muted-foreground">{exp.company}</div>
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{exp.period}</span>
                          {exp.current && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Current employment" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                          {exp.employmentType}
                        </span>
                      </td>
                      <td className="p-4 md:p-5">
                        <div className="flex flex-wrap gap-1 max-w-[200px] md:max-w-xs">
                          {Array.isArray(exp.technologies)
                            ? exp.technologies.slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-[10px] bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded-full">
                                  {tech}
                                </span>
                              ))
                            : null}
                          {Array.isArray(exp.technologies) && exp.technologies.length > 3 && (
                            <span className="text-[10px] text-muted-foreground px-1">
                              +{exp.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(exp)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit experience"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete experience"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
