import React, { useState } from 'react';
import { Sprout, Scissors, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import axios from 'axios';

const MissionPlanner = () => {
  const [missionType, setMissionType] = useState('planting');
  const [selectedCells, setSelectedCells] = useState([]);
  const [missionName, setMissionName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const gridSize = 25;

  // Toggle Zone
  const toggleCell = (index) => {
    if (selectedCells.includes(index)) {
      setSelectedCells(selectedCells.filter((i) => i !== index));
    } else {
      setSelectedCells([...selectedCells, index]);
    }
  };

  // -----------------------
  // ⭐ FINAL SUBMIT FUNCTION
  // -----------------------
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const farmerId = JSON.parse(localStorage.getItem("user"))._id;
      const token = localStorage.getItem("token");

      // Convert selected cell numbers to readable zones  
      const zones = selectedCells.map(z => `Zone ${z + 1}`);

      // Auto-generate mission name if empty
      const finalMissionName =
        missionName.trim() !== ""
          ? missionName
          : `${missionType.toUpperCase()} Mission (${zones.length} Zones)`;

      const res = await axios.post(
        "http://localhost:5000/api/missions/create",
        {
          farmerId,
          missionName: finalMissionName,
          missionType,
          zones,
          fieldName,
          priority
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Mission successfully submitted to Admin!");
      setLoading(false);
      setSelectedCells([]);

    } catch (err) {
      console.log(err);
      alert("Mission submit failed ❌");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">🚜 Mission Planner</h1>
        <p className="text-slate-500">Select an area and assign a robot task.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Select Mission Type */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Step 1: Choose Mission Type</h3>

            <div className="grid grid-cols-2 gap-4">
              
              <button
                onClick={() => setMissionType('planting')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                  missionType === 'planting'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200'
                }`}
              >
                <Sprout size={32} />
                Planting
              </button>

              <button
                onClick={() => setMissionType('weeding')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                  missionType === 'weeding'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200'
                }`}
              >
                <Scissors size={32} />
                Weeding
              </button>

            </div>
          </div>

          {/* Mission Details Input */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">

            <label className="text-sm font-bold">Mission Name</label>
            <input
              type="text"
              placeholder="Optional (auto will be created)"
              className="w-full p-2 border rounded-lg mt-1 mb-4"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
            />

            <label className="text-sm font-bold">Field Name</label>
            <input
              type="text"
              placeholder="Eg. North Field"
              className="w-full p-2 border rounded-lg mt-1 mb-4"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />

            <label className="text-sm font-bold">Priority</label>
            <select
              className="w-full p-2 border rounded-lg mt-1"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

          </div>

          {/* Summary + Submit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Step 3: Review & Submit</h3>

            <div className="text-sm space-y-2 mb-4">
              <p>Mission Type: <b>{missionType}</b></p>
              <p>Zones Selected: <b>{selectedCells.length}</b></p>
              <p>Battery Use: <b>{selectedCells.length * 4}%</b></p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || selectedCells.length === 0}
              className={`w-full py-4 rounded-xl text-white font-bold ${
                selectedCells.length === 0
                  ? "bg-gray-300"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {loading ? "Processing..." : "Submit Mission ✔"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: GRID */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Step 2: Select Zones</h3>

          <div className="grid grid-cols-5 gap-2 bg-slate-50 p-4 rounded-xl">
            {[...Array(gridSize)].map((_, index) => (
              <button
                key={index}
                onClick={() => toggleCell(index)}
                className={`rounded-lg border p-4 text-xs relative ${
                  selectedCells.includes(index)
                    ? missionType === "planting"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-white border-slate-300"
                }`}
              >
                Z-{index + 1}
                {selectedCells.includes(index) && (
                  <MapPin className="absolute right-1 top-1 text-white" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            <AlertCircle className="inline mr-2" size={18} />
            Tip: Select zones in the order you want the robot to move.
          </div>
        </div>

      </div>
    </div>
  );
};

export default MissionPlanner;
