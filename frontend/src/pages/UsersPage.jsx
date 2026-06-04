import { useState } from "react";
import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../utils/constants';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const USERS_SEED = [
  { id: "U001", name: "Alex Morgan", email: "admin@grandprix2025.com", role: "admin", phone: "+1 555 0100", org: "International Racing Federation", status: "active" },
  { id: "U002", name: "Sarah Whitfield", email: "host@churchilldowns.com", role: "host", phone: "+1 555 0200", org: "Churchill Downs", status: "active" },
  { id: "U003", name: "Miguel Torres", email: "miguel.torres@racing.com", role: "jockey", phone: "+1 555 0301", org: null, licenseNo: "JLN-4821", status: "active" },
  { id: "U004", name: "Carlos Ruiz", email: "carlos.ruiz@racing.com", role: "jockey", phone: "+1 555 0302", org: null, licenseNo: "JLN-7156", status: "active" },
  { id: "U005", name: "Emma Sinclair", email: "emma.sinclair@racing.com", role: "jockey", phone: "+1 555 0303", org: null, licenseNo: "JLN-3390", status: "active" },
  { id: "U006", name: "Robert Blackwell", email: "robert@sunrisestables.com", role: "owner", phone: "+1 555 0401", org: "Sunrise Stables", status: "active" },
  { id: "U007", name: "Diana Chen", email: "diana@blueriverfarm.com", role: "owner", phone: "+1 555 0402", org: "Blue River Farm", status: "active" },
  { id: "U008", name: "James O'Brien", email: "james.ref@racing.com", role: "referee", phone: "+1 555 0501", org: null, status: "active" },
  { id: "U009", name: "Lisa Spectator", email: "lisa@email.com", role: "spectator", phone: "+1 555 0601", org: null, status: "active" },
  { id: "U010", name: "John Fan", email: "john@email.com", role: "spectator", phone: "+1 555 0602", org: null, status: "inactive" },
];

const ROLES = ["admin", "host", "jockey", "owner", "spectator", "referee"];

const ROLE_COLORS = {
  admin:    { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
  host:     { bg: "#EFF6FF", color: "#1E40AF", border: "#93C5FD" },
  jockey:   { bg: "#F5F3FF", color: "#5B21B6", border: "#C4B5FD" },
  owner:    { bg: "#ECFDF5", color: "#065F46", border: "#6EE7B7" },
  spectator:{ bg: "#F9FAFB", color: "#374151", border: "#D1D5DB" },
  referee:  { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
};

export default function UsersPage() {
  const [users, setUsers] = useState(USERS_SEED);
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "spectator", phone: "", org: "", licenseNo: "", status: "active" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter(u => {
    if (filter === "all") return true;
    if (filter === "active") return u.status === "active";
    if (filter === "inactive") return u.status === "inactive";
    return u.role === filter;
  });

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === "admin").length,
    host: users.filter(u => u.role === "host").length,
    jockey: users.filter(u => u.role === "jockey").length,
    owner: users.filter(u => u.role === "owner").length,
    spectator: users.filter(u => u.role === "spectator").length,
    referee: users.filter(u => u.role === "referee").length,
    active: users.filter(u => u.status === "active").length,
    inactive: users.filter(u => u.status === "inactive").length,
  };

  const toggleStatus = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    showToast("User status updated.");
  };

  const saveUser = () => {
    if (!newUser.name || !newUser.email) return;
    const id = "U" + String(users.length + 1).padStart(3, "0");
    setUsers(us => [...us, { ...newUser, id }]);
    setShowAdd(false);
    setNewUser({ name: "", email: "", role: "spectator", phone: "", org: "", licenseNo: "", status: "active" });
    showToast("User created successfully.");
  };

  const updateUser = () => {
    if (!editUser.name || !editUser.email) return;
    setUsers(us => us.map(u => u.id === editUser.id ? { ...u, ...editUser } : u));
    setEditUser(null);
    showToast("User updated successfully.");
  };

  return (
    <div>
      <SectionTitle icon="users" sub="View, create, edit, and deactivate user accounts. Assign roles and manage access.">
        User Management
      </SectionTitle>

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 99999,
          background: "#F0FDF4", color: "#166534", border: "1px solid #86EFAC",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          <i className="ti ti-circle-check" style={{ marginRight: 8 }} aria-hidden />{toast}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { key: "all", label: "All" },
          { key: "admin", label: "Admin" },
          { key: "host", label: "Host" },
          { key: "jockey", label: "Jockey" },
          { key: "owner", label: "Owner" },
          { key: "spectator", label: "Spectator" },
          { key: "referee", label: "Referee" },
          { key: "active", label: "Active" },
          { key: "inactive", label: "Inactive" },
        ].map(({ key, label }) => (
          <div
            key={key}
            onClick={() => setFilter(key)}
            style={{
              background: filter === key ? EMERALD : "#fff",
              color: filter === key ? "#fff" : "#6B7280",
              border: `1px solid ${filter === key ? EMERALD : "#E5E7EB"}`,
              borderRadius: 8, padding: "10px 12px", textAlign: "center",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{counts[key] || 0}</div>
            <div style={{ fontSize: 10, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button variant="primary" onClick={() => setShowAdd(true)} icon="user-plus">
          Add User
        </Button>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["User", "Email", "Role", "Phone", "Organization", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const rc = ROLE_COLORS[user.role] || ROLE_COLORS.spectator;
              return (
                <tr key={user.id} style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: rc.bg, border: `1px solid ${rc.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: rc.color, flexShrink: 0,
                      }}>
                        {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111827" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{user.email}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#6B7280" }}>{user.phone}</td>
                  <td style={{ padding: "10px 14px", color: "#6B7280" }}>{user.org || (user.licenseNo ? `License: ${user.licenseNo}` : "—")}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                      background: user.status === "active" ? "#D1FAE5" : "#FEE2E2",
                      color: user.status === "active" ? "#166534" : "#991B1B",
                    }}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Button small variant="ghost" onClick={() => setEditUser({ ...user })} icon="edit">Edit</Button>
                      <Button small variant={user.status === "active" ? "danger" : "success"} onClick={() => toggleStatus(user.id)} icon={user.status === "active" ? "x" : "check"}>
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Add User Modal */}
      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)} wide>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
            <Field label="Full Name" required>
              <Input value={newUser.name} onChange={v => setNewUser(u => ({ ...u, name: v }))} placeholder="John Doe" />
            </Field>
            <Field label="Email" required half>
              <Input type="email" value={newUser.email} onChange={v => setNewUser(u => ({ ...u, email: v }))} placeholder="john@example.com" />
            </Field>
            <Field label="Phone" half>
              <Input value={newUser.phone} onChange={v => setNewUser(u => ({ ...u, phone: v }))} placeholder="+1 555 0000" />
            </Field>
            <Field label="Role" required half>
              <Select value={newUser.role} onChange={v => setNewUser(u => ({ ...u, role: v }))} options={ROLES} />
            </Field>
            <Field label="Organization / Stable" half>
              <Input value={newUser.org} onChange={v => setNewUser(u => ({ ...u, org: v }))} placeholder="Sunrise Stables" />
            </Field>
            <Field label="License No. (jockeys)" half>
              <Input value={newUser.licenseNo} onChange={v => setNewUser(u => ({ ...u, licenseNo: v }))} placeholder="JLN-0000" />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveUser} icon="user-plus">Create User</Button>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal title={`Edit User — ${editUser.name}`} onClose={() => setEditUser(null)} wide>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
            <Field label="Full Name" required>
              <Input value={editUser.name} onChange={v => setEditUser(u => ({ ...u, name: v }))} />
            </Field>
            <Field label="Email" required half>
              <Input type="email" value={editUser.email} onChange={v => setEditUser(u => ({ ...u, email: v }))} />
            </Field>
            <Field label="Phone" half>
              <Input value={editUser.phone} onChange={v => setEditUser(u => ({ ...u, phone: v }))} />
            </Field>
            <Field label="Role" required half>
              <Select value={editUser.role} onChange={v => setEditUser(u => ({ ...u, role: v }))} options={ROLES} />
            </Field>
            <Field label="Organization / Stable" half>
              <Input value={editUser.org || ""} onChange={v => setEditUser(u => ({ ...u, org: v }))} />
            </Field>
            <Field label="Status" half>
              <Select value={editUser.status} onChange={v => setEditUser(u => ({ ...u, status: v }))} options={["active", "inactive"]} />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button variant="primary" onClick={updateUser} icon="device-floppy">Save Changes</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
