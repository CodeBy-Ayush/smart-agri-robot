// Crop Recommendation Using gemini 
//-------------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import { Sprout, Droplets, DollarSign, AlertTriangle, Leaf, CheckCircle, Loader2 } from 'lucide-react';
import axios from "axios";
const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    phLevel: '',
    rainfall: '',
    city: '',
    acres: ''
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setPrediction(null);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/ai/recommend-crop",
      formData
    );
    setPrediction(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to get recommendation");
  } finally {
    setLoading(false);
  }
};
//Crop Recommendation
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
           <Leaf className="text-green-500" /> AI Crop Recommendation
        </h1>
        <p className="text-slate-500">
          Enter soil and environmental details to get the most profitable crop suggestion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold text-slate-700 mb-4">🌱 Soil & Farm Data</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Nitrogen (N)</label>
                <input required name="nitrogen" type="number" placeholder="e.g. 90" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Phosphorus (P)</label>
                <input required name="phosphorus" type="number" placeholder="e.g. 42" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Potassium (K)</label>
                <input required name="potassium" type="number" placeholder="e.g. 43" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600">pH Level</label>
                <input required name="phLevel" type="number" step="0.1" placeholder="e.g. 6.5" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600">Rainfall (mm)</label>
                <input required name="rainfall" type="number" placeholder="e.g. 200" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Farm Location (City)</label>
              <input required name="city" type="text" placeholder="e.g. Ludhiana, Punjab" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
            </div>

            <div>
               <label className="text-sm font-bold text-slate-600">Land Size (Acres)</label>
               <input required name="acres" type="number" placeholder="e.g. 5" className="w-full p-2 border rounded-lg bg-slate-50 focus:outline-green-500" onChange={handleChange} />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" /> Analyzing Soil...</> : 'Get AI Recommendation'}
            </button>
          </form>
        </div>

        {/* RIGHT: AI Result Display */}
        <div className="lg:col-span-2">
          
          {!prediction && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
              <Sprout size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No data analyzed yet.</p>
              <p className="text-sm">Fill the form to ask the AI.</p>
            </div>
          )}

          {loading && (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100">
               <div className="relative">
                 <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                 <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" size={24} />
               </div>
               <p className="mt-4 text-slate-600 font-medium animate-pulse">Consulting AI Agro-Expert...</p>
             </div>
          )}

          {prediction && (
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden animate-fade-in-up">
              
              {/* Result Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-8 text-white relative">
                <p className="opacity-80 text-sm font-bold tracking-wider uppercase">Best Crop Match</p>
                <h2 className="text-5xl font-extrabold mt-2">{prediction.crop}</h2>
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                   <span className="font-bold">✨ {prediction.confidence} Match</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-100">
                 <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase">Exp. Yield</p>
                    <p className="text-green-800 font-bold text-lg leading-tight">{prediction.estimatedYield}</p>
                 </div>
                 <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase">Water Needs</p>
                    <p className="text-blue-800 font-bold text-sm leading-tight mt-1">{prediction.waterNeeds}</p>
                 </div>
                 <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase">Market Price</p>
                    <p className="text-yellow-800 font-bold text-lg leading-tight">{prediction.marketPrice}</p>
                 </div>
                 <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-bold uppercase">Fertilizer</p>
                    <p className="text-red-800 font-bold text-xs leading-tight mt-1">{prediction.requiredFertilizer}</p>
                 </div>
              </div>

              {/* Detailed Tips & Risk */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <CheckCircle size={20} className="text-green-600"/> Cultivation Tips
                    </h4>
                    <ul className="space-y-3">
                       {prediction.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                             <span className="bg-green-200 text-green-800 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">{i+1}</span>
                             {tip}
                          </li>
                       ))}
                    </ul>
                 </div>
                 
                 <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <AlertTriangle size={20} className="text-orange-500"/> Risk Analysis
                    </h4>
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                       <p className="text-orange-800 text-sm leading-relaxed">
                          {prediction.riskAnalysis}
                       </p>
                    </div>

                    <button className="w-full mt-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2">
                       <DollarSign size={18} /> View Profit Calculator
                    </button>
                 </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CropRecommendation;
