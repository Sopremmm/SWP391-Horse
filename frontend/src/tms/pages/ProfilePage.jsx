import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { ROLE_LABELS } from "../users.js";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  TEXT_MUTED,
} from "../constants.js";
import AppShell from "../components/layout/AppShell.jsx";

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all"
      style={{ borderColor: BORDER }}
    />
  );
}

function Textarea({ value, onChange, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all resize-none"
      style={{ borderColor: BORDER }}
    />
  );
}

export default function ProfilePage() {
  const { user, updateProfile, goDashboard } = useApp();
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!user) return;
    updateProfile(user.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell subtitle="My Profile" showNav={false} showBreadcrumb={false}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={goDashboard}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 cursor-pointer font-sans bg-transparent border-none p-0 mb-3 transition-colors"
          >
            <i className="ti ti-arrow-left text-base" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border-2"
              style={{ background: BRAND_LIGHT, borderColor: BRAND_BORDER, color: BRAND_TEXT }}
            >
              {user?.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 m-0 font-serif">{user?.name}</h1>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{ background: BRAND_LIGHT, color: BRAND_TEXT, borderColor: BRAND_BORDER }}
              >
                {user ? ROLE_LABELS[user.role]?.toUpperCase() : ""}
              </span>
            </div>
          </div>
        </div>

        {saved && (
          <div className="mb-4 px-4 py-3 rounded-xl border font-sans text-sm font-semibold flex items-center gap-2"
            style={{ background: BRAND_LIGHT, borderColor: BRAND_BORDER, color: BRAND_TEXT }}>
            <i className="ti ti-circle-check text-base" />
            Profile saved successfully.
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-x-4">
            <div className="flex-1 min-w-[200px]">
              <Field label="Full Name">
                <Input value={form.name || ""} onChange={setField("name")} />
              </Field>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Field label="Email">
                <Input type="email" value={form.email || ""} onChange={setField("email")} />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4">
            <div className="flex-1 min-w-[200px]">
              <Field label="Phone">
                <Input value={form.phone || ""} onChange={setField("phone")} />
              </Field>
            </div>
            <div className="flex-1 min-w-[200px]">
              {user?.role === "admin" && (
                <Field label="Organization">
                  <Input value={form.org || ""} onChange={setField("org")} />
                </Field>
              )}
              {user?.role === "host" && (
                <Field label="Venue">
                  <Input value={form.venue || ""} onChange={setField("venue")} />
                </Field>
              )}
              {user?.role === "jockey" && (
                <Field label="License Number">
                  <Input value={form.licenseNo || ""} onChange={setField("licenseNo")} />
                </Field>
              )}
              {user?.role === "owner" && (
                <Field label="Stable Name">
                  <Input value={form.org || ""} onChange={setField("org")} />
                </Field>
              )}
            </div>
          </div>

          <Field label="Bio">
            <Textarea value={form.bio || ""} onChange={setField("bio")} rows={3} />
          </Field>

          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={goDashboard}
              className="px-4 py-2 rounded-xl border font-sans text-sm font-semibold cursor-pointer bg-transparent transition-all"
              style={{ borderColor: BORDER, color: TEXT_MUTED }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="px-4 py-2 rounded-xl border font-sans text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all"
              style={{ background: BRAND, borderColor: BRAND, color: "#fff", boxShadow: "0 1px 2px rgba(6,78,59,0.25)" }}
            >
              <i className="ti ti-device-floppy text-base" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
