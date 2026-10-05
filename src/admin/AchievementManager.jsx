import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/Button";

export const AchievementManager = () => {
  const { data, saveItem, deleteItem, uploadImage } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const resetForm = () => {
    setCurrentItem(null);
    setTitle("");
    setDescription("");
    setDate("");
    setImage("");
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setDate(item.date || "");
    setImage(item.image || "");
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

    const itemToSave = {
      id: currentItem ? currentItem.id : undefined,
      title,
      description,
      date,
      image
    };

    const res = await saveItem("achievements", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      await deleteItem("achievements", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Achievements</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your portfolio achievements and awards</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Achievement
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
            {currentItem ? "Edit Achievement" : "New Achievement"}
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Achievement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hackathon Winner"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date / Year Received</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 2025"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Photo Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Achievement Image (Optional)</label>
              <div className="flex gap-4 items-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-border bg-muted/10 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-surface border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-[10px] text-center p-1 leading-tight flex-shrink-0">
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

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Achievement Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your achievement and the criteria to win..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors h-24 resize-none"
              />
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
              {currentItem ? "Save Changes" : "Create Achievement"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Achievement</th>
                  <th className="p-4 md:p-5 font-semibold">Description</th>
                  <th className="p-4 md:p-5 font-semibold">Date</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.achievements.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted-foreground">
                      No achievements found. Add your accomplishments above.
                    </td>
                  </tr>
                ) : (
                  data.achievements.map((ach) => (
                    <tr key={ach.id} className="hover:bg-surface/20 transition-colors">
                      <td className="p-4 md:p-5 flex items-center gap-4">
                        {ach.image ? (
                          <img src={ach.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-border/30 bg-muted/10 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] text-muted-foreground flex-shrink-0 font-bold uppercase">
                            AWARD
                          </div>
                        )}
                        <div className="font-semibold text-foreground text-sm md:text-base">
                          {ach.title}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-sm text-muted-foreground max-w-xs truncate">
                        {ach.description}
                      </td>
                      <td className="p-4 md:p-5 text-sm whitespace-nowrap">
                        {ach.date}
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(ach)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit achievement"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(ach.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete achievement"
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
