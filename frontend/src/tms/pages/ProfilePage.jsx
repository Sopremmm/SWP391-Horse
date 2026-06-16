import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { ROLE_LABELS } from "../users.js";
import HeritageLayout, { FONT_SERIF } from "../components/layout/HeritageLayout.jsx";
import {
  HeritageCard,
  HeritageButton,
  HeritageToast,
  HeritagePageHeader,
  HeritageField,
  HeritageInput,
  HeritageTextarea,
} from "../components/layout/HeritageUI.jsx";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({ ...user });
  const [toast, setToast] = useState(null);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!user) return;
    updateProfile(user.id, form);
    setToast("Profile saved successfully.");
    setTimeout(() => setToast(null), 2500);
  };

  const goDashboard = () => {
    const map = {
      admin: "/admin", host: "/host", owner: "/owner",
      jockey: "/jockey", referee: "/referee", spectator: "/spectator/home",
    };
    navigate(map[user?.role] || "/");
  };

  return (
    <HeritageLayout role={user?.role} subtitle="My Profile">
      <HeritagePageHeader
        eyebrow="My Profile"
        title="Account Settings"
        subtitle="Update your personal information and account details."
      />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 64px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16" style={{ maxWidth: 720 }}>
          <button
            type="button"
            onClick={goDashboard}
            className="cursor-pointer bg-transparent border-0 mb-4"
            style={{ color: "#555e58", fontSize: "0.82rem", fontWeight: 600, padding: 0 }}
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center" style={{ gap: 16, marginBottom: 24 }}>
            <div
              className="grid place-items-center"
              style={{
                width: 64, height: 64, borderRadius: 999,
                background: "#002a15", color: "#ffdea5",
                fontSize: "1.3rem", fontWeight: 800, letterSpacing: "0.05em",
              }}
            >
              {user?.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2
                className="m-0"
                style={{ color: "#002a15", fontSize: "1.7rem", fontWeight: 500, fontFamily: FONT_SERIF }}
              >
                {user?.name}
              </h2>
              <span
                className="inline-block"
                style={{
                  marginTop: 6,
                  padding: "3px 12px", borderRadius: 999,
                  background: "rgba(255,222,165,0.4)", color: "#002a15",
                  fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {user ? ROLE_LABELS[user.role]?.toUpperCase() : ""}
              </span>
            </div>
          </div>

          <HeritageCard padding={32}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <HeritageField label="Full Name">
                <HeritageInput value={form.name || ""} onChange={(e) => setField("name")(e.target.value)} />
              </HeritageField>
              <HeritageField label="Email">
                <HeritageInput type="email" value={form.email || ""} onChange={(e) => setField("email")(e.target.value)} />
              </HeritageField>
              <HeritageField label="Phone">
                <HeritageInput value={form.phone || ""} onChange={(e) => setField("phone")(e.target.value)} />
              </HeritageField>
              <HeritageField
                label={
                  user?.role === "admin" ? "Organization" :
                  user?.role === "host" ? "Venue" :
                  user?.role === "owner" ? "Stable Name" :
                  user?.role === "jockey" ? "License Number" : "Details"
                }
              >
                <HeritageInput
                  value={
                    form.venue || form.org || form.licenseNo || ""
                  }
                  onChange={(e) => {
                    const k = user?.role === "host" ? "venue" :
                              user?.role === "jockey" ? "licenseNo" : "org";
                    setField(k)(e.target.value);
                  }}
                />
              </HeritageField>
            </div>
            <HeritageField label="Bio" hint="Tell others a little about yourself (optional).">
              <HeritageTextarea
                value={form.bio || ""}
                onChange={(e) => setField("bio")(e.target.value)}
                rows={3}
              />
            </HeritageField>

            <div className="flex justify-end" style={{ gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0ede4" }}>
              <HeritageButton variant="outline" onClick={goDashboard}>Cancel</HeritageButton>
              <HeritageButton onClick={save}>Save Profile</HeritageButton>
            </div>
          </HeritageCard>
        </div>
      </section>

      <HeritageToast message={toast} onClose={() => setToast(null)} />
    </HeritageLayout>
  );
}
