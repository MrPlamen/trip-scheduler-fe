import { useState } from "react";
import request from "../../utils/request";
import "./AdminPanel.css";

const BASE_URL = "http://localhost:8080";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const searchUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setUser(null);

    try {
      const response = await request.get(`${BASE_URL}/admin/search?email=${email}`, { credentials: "include" });
      setUser(response);
    } catch (err) {
      setMessage(err?.error || "User not found");
    }
  };

  const blockUser = async (userId) => {
    try {
      await request.post(`${BASE_URL}/admin/block/${userId}`, {}, { credentials: "include" });
      setUser({ ...user, blocked: true });
      setMessage("User blocked successfully");
    } catch (err) {
      setMessage("Failed to block user");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await request.post(`${BASE_URL}/admin/unblock/${userId}`, {}, { credentials: "include" });
      setUser({ ...user, blocked: false });
      setMessage("User unblocked successfully");
    } catch (err) {
      setMessage("Failed to unblock user");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await request.post(`${BASE_URL}/admin/role/${userId}?role=${role}`, {}, { credentials: "include" });
      setUser({ ...user, role });
      setMessage("Role updated successfully");
    } catch (err) {
      setMessage("Failed to update role");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <form onSubmit={searchUser} className="search-form">
        <input
          type="text"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {message && <p className="message">{message}</p>}

      {user && (
        <div className="user-card">
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p>
            <b>Role:</b>
            <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </p>
          <p><b>Status:</b> {user.blocked ? "Blocked" : "Active"}</p>
          <div className="actions">
            {!user.blocked && <button onClick={() => blockUser(user.id)}>Block</button>}
            {user.blocked && <button onClick={() => unblockUser(user.id)}>Unblock</button>}
          </div>
        </div>
      )}
    </div>
  );
}
