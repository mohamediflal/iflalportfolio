import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";

export const EducationManager = () => {
  const { data, saveItem, deleteItem } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form states
  const [institutionName, setInstitutionName] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setCurrentItem(null);
    setInstitutionName("");
    setDegree("");
    setField("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setInstitutionName(item.institutionName || "");
    setDegree(item.degree || "");
    setField(item.field || "");
    setStartDate(item.startDate || "");
    setEndDate(item.endDate || "");
    setDescription(item.description || "");
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemToSave = {
      id: currentItem ? currentItem.id : undefined,
      institutionName,
      degree,
      field,
      startDate,
      endDate,
      description
    };

    const res = await saveItem("education", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      await deleteItem("education", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Education</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your academic credentials</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Education
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-3xl space-y-6 max-w-2xl animate-fade-in relative">
          <button
            type="button"
            onClick={resetForm}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-semibold border-b border-border pb-3">
            {currentItem ? "Edit Education" : "New Education"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Institution Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. University of Colombo"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Degree Type</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Science (Hons)"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Field of Study */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Field of Study</label>
                <input
                  type="text"
                  required
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Start Year / Date</label>
                <input
                  type="text"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">End Year / Date (or 'Present')</label>
                <input
                  type="text"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="e.g. 2027 or Present"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your major subjects, accomplishments, or project work..."
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
              {currentItem ? "Save Changes" : "Create Education Entry"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Institution</th>
                  <th className="p-4 md:p-5 font-semibold">Degree & Field</th>
                  <th className="p-4 md:p-5 font-semibold">Period</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.education.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted-foreground">
                      No education entries found. Add your academic profile above.
                    </td>
                  </tr>
                ) : (
                  data.education.map((edu) => (
                    <tr key={edu.id} className="hover:bg-surface/20 transition-colors">
                      <td className="p-4 md:p-5 font-semibold text-foreground text-sm md:text-base">
                        {edu.institutionName}
                      </td>
                      <td className="p-4 md:p-5 text-sm text-muted-foreground">
                        {edu.degree} in {edu.field}
                      </td>
                      <td className="p-4 md:p-5 text-sm whitespace-nowrap">
                        {edu.startDate} — {edu.endDate}
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(edu)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit education"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(edu.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete education"
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
