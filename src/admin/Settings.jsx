import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";
import { Button } from "@/components/Button";
import { Download, RefreshCw, Key, ShieldAlert } from "lucide-react";

export const Settings = () => {
  const { data, visibility, toggleVisibility, downloadJson, resetToDefault, isReadOnly } = usePortfolio();
  
  // Credentials states
  const [email, setEmail] = useState(() => {
    const creds = localStorage.getItem("portfolio_admin_credentials");
    if (creds) {
      try { return JSON.parse(creds).email || "iflalportfolio@admin.com"; } catch(e) {}
    }
    return "iflalportfolio@admin.com";
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("success");

  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    if (!password) {
      setStatusMsg("Password cannot be empty");
      setStatusType("error");
      return;
    }
    if (password !== confirmPassword) {
      setStatusMsg("Passwords do not match");
      setStatusType("error");
      return;
    }

    localStorage.setItem(
      "portfolio_admin_credentials",
      JSON.stringify({ email, password })
    );
    setPassword("");
    setConfirmPassword("");
    setStatusMsg("Admin credentials updated successfully!");
    setStatusType("success");
  };

  const handleResetSection = (section) => {
    if (window.confirm(`Are you sure you want to reset the ${section} data to the baseline defaults? This will erase any local browser overrides.`)) {
      resetToDefault(section);
      alert(`${section} has been reset.`);
    }
  };

  const sections = ["projects", "experience", "skills", "education", "certifications", "achievements", "settings"];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your credentials, backup configuration files, or reset defaults</p>
      </div>

      {isReadOnly && (
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3 text-yellow-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">Production Mode (Preview Only)</span>
            Since the site is hosted on a static server, direct changes cannot write directly to your git repository. 
            Use the **Export Configuration** section below to download your updated files, place them in `src/data/`, and push to your git repository to redeploy!
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Credentials Form */}
        <form onSubmit={handleUpdateCredentials} className="glass p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Key className="text-primary w-5 h-5" />
            <h3 className="text-lg font-semibold">Change Login Credentials</h3>
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl border text-sm ${
              statusType === "success" 
                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              {statusMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          <Button type="submit" className="w-full">
            Update Credentials
          </Button>
        </form>

        {/* Data Operations */}
        <div className="glass p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Download className="text-primary w-5 h-5" />
            <h3 className="text-lg font-semibold">Backup & Data Recovery</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Export Configurations (JSON)</h4>
              <p className="text-xs text-muted-foreground mb-3">Download your current configuration to save in the `src/data` project folder.</p>
              
              <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => downloadJson(section)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface border border-border hover:border-primary/30 text-xs font-medium transition-colors cursor-pointer text-left capitalize"
                  >
                    <span>{section}</span>
                    <Download size={12} className="text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                <RefreshCw size={14} /> Danger Zone: Restore Defaults
              </h4>
              <p className="text-xs text-muted-foreground mb-3">Clear client browser storage and reset sections to static template files.</p>
              
              <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => handleResetSection(section)}
                    className="px-3 py-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-[11px] font-medium text-red-400 transition-colors cursor-pointer capitalize text-center"
                  >
                    Reset {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
