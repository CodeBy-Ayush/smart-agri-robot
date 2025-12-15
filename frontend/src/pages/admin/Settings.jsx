import React, { useState } from "react";
import { Save, Bell, Shield } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    systemErrors: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">⚙️ System Settings</h1>
        <p className="text-slate-500">Manage admin preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-blue-500" /> Notifications
          </h3>

          {/* Email Alerts */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Email Alerts</span>
            <button
              onClick={() => handleToggle("emailAlerts")}
              className={`w-12 h-6 rounded-full p-1 ${
                notifications.emailAlerts ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                  notifications.emailAlerts ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-3 mt-3 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">SMS Alerts</span>
            <button
              onClick={() => handleToggle("smsAlerts")}
              className={`w-12 h-6 rounded-full p-1 ${
                notifications.smsAlerts ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                  notifications.smsAlerts ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Error Logs */}
          <div className="flex items-center justify-between p-3 mt-3 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">System Errors</span>
            <button
              onClick={() => handleToggle("systemErrors")}
              className={`w-12 h-6 rounded-full p-1 ${
                notifications.systemErrors ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                  notifications.systemErrors ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-purple-500" /> Security
          </h3>

          <p className="font-medium text-slate-700">Two-Factor (Coming Soon)</p>
        </div>

      </div>

      {/* Footer Save */}
      <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between">
        <p>Save all configuration changes</p>
        <button className="px-6 py-3 bg-blue-600 rounded-lg flex items-center gap-2">
          <Save size={20} /> Save
        </button>
      </div>
    </div>
  );
}
