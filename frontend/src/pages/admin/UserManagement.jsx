import React, { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  Ban,
  CheckCircle,
  Search,
} from "lucide-react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load all users from backend
  useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  setUsers(res.data);
};

// BLOCK / UNBLOCK
const toggleStatus = async (id) => {
  const token = localStorage.getItem("token");

  await axios.patch(
    `http://localhost:5000/api/admin/users/${id}/status`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  loadUsers();
};

// DELETE
const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  loadUsers();
};


  // Search logic
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            👥 User Management
          </h1>
          <p className="text-slate-500">
            Control access and manage registered users.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-500 uppercase">
                User
              </th>
              <th className="p-4 text-sm font-bold text-slate-500 uppercase">
                Role
              </th>
              <th className="p-4 text-sm font-bold text-slate-500 uppercase">
                Status
              </th>
              <th className="p-4 text-sm font-bold text-slate-500 uppercase">
                Joined
              </th>
              <th className="p-4 text-sm font-bold text-slate-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Avatar + Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {user.username}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {user.role === "admin"
                        ? "🛡️ Admin"
                        : "👨‍🌾 Farmer"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        user.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Ban size={14} />
                      )}
                      {user.status}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td className="p-4 text-sm text-slate-500">
                    {user.createdAt?.split("T")[0]}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Block / Unblock */}
                      <button
                        onClick={() =>
                          toggleStatus(
                            user._id,
                            user.status === "Blocked"
                              ? "Active"
                              : "Blocked"
                          )
                        }
                        className={`p-2 rounded-lg transition ${
                          user.status === "Blocked"
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                        }`}
                      >
                        {user.status === "Blocked" ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Ban size={18} />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        <Trash2 size={18} />
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
  );
};

export default UserManagement;
