import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Plus, Edit2, Trash2, X, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/Button";

export const CertificationManager = () => {
  const { data, saveItem, deleteItem, uploadImage } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [certificateName, setCertificateName] = useState("");
  const [organization, setOrganization] = useState("");
  const [image, setImage] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialLink, setCredentialLink] = useState("");

  const resetForm = () => {
    setCurrentItem(null);
    setCertificateName("");
    setOrganization("");
    setImage("");
    setIssueDate("");
    setCredentialLink("");
    setIsEditing(false);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setCurrentItem(item);
    setCertificateName(item.certificateName || "");
    setOrganization(item.organization || "");
    setImage(item.image || "");
    setIssueDate(item.issueDate || "");
    setCredentialLink(item.credentialLink || "");
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
      certificateName,
      organization,
      image,
      issueDate,
      credentialLink
    };

    const res = await saveItem("certifications", itemToSave);
    if (res.warning) {
      alert(res.warning);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      await deleteItem("certifications", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Certifications</h2>
          <p className="text-sm text-muted-foreground">Add, update or remove items from your professional certifications</p>
        </div>
        {!isEditing && (
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Certification
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
            {currentItem ? "Edit Certification" : "New Certification"}
          </h3>

          <div className="space-y-4">
            {/* Certificate Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Certificate Name</label>
              <input
                type="text"
                required
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Issuing Organization</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Amazon Web Services (AWS)"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Issue Date / Year</label>
              <input
                type="text"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. 2025"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Credential Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Credential Verification Link</label>
              <input
                type="text"
                value={credentialLink}
                onChange={(e) => setCredentialLink(e.target.value)}
                placeholder="e.g. https://aws.amazon.com/verify/..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Badge Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Certificate Image (Optional)</label>
              <div className="flex gap-4 items-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-16 h-16 object-contain rounded-xl border border-border bg-white p-1 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-surface border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-[10px] text-center p-1 leading-tight flex-shrink-0">
                    No Badge Image
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Or enter badge image URL"
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
              {currentItem ? "Save Changes" : "Create Certification"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Certificate</th>
                  <th className="p-4 md:p-5 font-semibold">Organization</th>
                  <th className="p-4 md:p-5 font-semibold">Issue Date</th>
                  <th className="p-4 md:p-5 font-semibold">Credential</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.certifications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                      No certifications found. Add your first certificate above.
                    </td>
                  </tr>
                ) : (
                  data.certifications.map((cert) => (
                    <tr key={cert.id} className="hover:bg-surface/20 transition-colors">
                      <td className="p-4 md:p-5 flex items-center gap-4">
                        {cert.image ? (
                          <img src={cert.image} alt="" className="w-10 h-10 object-contain rounded-lg border border-border/30 bg-white p-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] text-muted-foreground flex-shrink-0 font-bold uppercase">
                            CERT
                          </div>
                        )}
                        <div className="font-semibold text-foreground text-sm md:text-base">
                          {cert.certificateName}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        {cert.organization}
                      </td>
                      <td className="p-4 md:p-5 text-sm whitespace-nowrap">
                        {cert.issueDate}
                      </td>
                      <td className="p-4 md:p-5 text-sm">
                        {cert.credentialLink && cert.credentialLink !== "#" ? (
                          <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-xs">
                            View <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">No link</span>
                        )}
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(cert)}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit certification"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete certification"
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
