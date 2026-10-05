import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";

export const SkillManager = () => {
  const { data, saveItem, deleteItem } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [level, setLevel] = useState("90%");
  const [icon, setIcon] = useState("Code2");

  const resetForm = () => {
    setCurrentItem(null);
    setName("");
    setCategory("Frontend");
    setLevel("90%");
    setIcon("Code2");
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setName(item.name || "");
    setCategory(item.category || "Frontend");
    setLevel(item.level || "90%");
    setIcon(item.icon || "Code2");
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate level formatting: ensure it ends with '%'
    let formattedLevel = level.trim();
    if (!formattedLevel.endsWith("%")) {
      formattedLevel = formattedLevel + "%";
    }

    const itemToSave = {
      id: currentItem ? currentItem.id : undefined,
      name,
      category,
      level: formattedLevel,
      icon
    };

    const res = await saveItem("skills", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteItem("skills", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Skills</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your tech stack & expertise</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Skill
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-3xl space-y-6 max-w-xl animate-fade-in relative">
          <button
            type="button"
            onClick={resetForm}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-semibold border-b border-border pb-3">
            {currentItem ? "Edit Skill" : "New Skill"}
          </h3>

          <div className="space-y-4">
            {/* Skill Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Skill Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React"
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
                <option value="Frontend">Frontend</option>
                <option value="Backend & Databases">Backend & Databases</option>
                <option value="Mobile & Design">Mobile & Design</option>
                <option value="Tools ">Tools / DevOps</option>
              </select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Proficiency Level (e.g. 90%)</label>
              <input
                type="text"
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. 95%"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Icon Descriptor</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              >
                <option value="Code2">Code (Code2)</option>
                <option value="Database">Database (Database)</option>
                <option value="Smartphone">Mobile (Smartphone)</option>
                <option value="Palette">Design (Palette)</option>
                <option value="Wrench">DevOps / Tool (Wrench)</option>
              </select>
            </div>
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
              {currentItem ? "Save Changes" : "Create Skill"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Skill Name</th>
                  <th className="p-4 md:p-5 font-semibold">Category</th>
                  <th className="p-4 md:p-5 font-semibold">Level / Progress</th>
                  <th className="p-4 md:p-5 font-semibold">Icon</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.skills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                      No skills found. Add your first technology above.
                    </td>
                  </tr>
                ) : (
                  data.skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-surface/20 transition-colors">
                      <td className="p-4 md:p-5 font-semibold text-sm md:text-base text-foreground">
                        {skill.name}
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {skill.category}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-10 font-mono text-xs">{skill.level}</span>
                          <div className="h-2 w-28 bg-muted rounded-full overflow-hidden relative hidden sm:block">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: skill.level }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-xs text-muted-foreground font-mono">
                        {skill.icon}
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(skill)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit skill"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete skill"
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
