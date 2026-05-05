"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { predictPower, getWeather, getTestData } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { CloudRain, Sun, Settings2, Activity, Zap } from 'lucide-react';

export default function Dashboard() {
  const [inputs, setInputs] = useState({
    ambient_temperature: 25.0,
    module_temperature: 30.0,
    irradiation: 0.5,
    hour: 12,
    day: 15,
    month: 6,
    model_type: 'rf'
  });

  const [weather, setWeather] = useState<{temperature: number; condition_code: number} | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [curveData, setCurveData] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load weather
    getWeather().then(data => {
      setWeather(data);
      setInputs(prev => ({ ...prev, ambient_temperature: data.temperature }));
    }).catch(console.error);

    // Load initial scatter data
    getTestData('rf').then(data => {
      setScatterData(data.scatter_data);
    }).catch(console.error);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const data = await predictPower(inputs);
      setPrediction(data.prediction);
      setCurveData(data.curve_data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <Zap className="text-yellow-400 w-8 h-8" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">SunLytics Dashboard</h1>
          </div>
          <select 
            value={inputs.model_type}
            onChange={(e) => {
              setInputs({...inputs, model_type: e.target.value});
              getTestData(e.target.value).then(d => setScatterData(d.scatter_data));
            }}
            className="bg-slate-900 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rf">Random Forest</option>
            <option value="lr">Linear Regression</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL - INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-2 mb-6">
                <Settings2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Parameters</h2>
              </div>

              <div className="space-y-6">
                {[
                  { id: 'ambient_temperature', label: 'Ambient Temp (°C)', min: 0, max: 50, step: 0.1 },
                  { id: 'module_temperature', label: 'Module Temp (°C)', min: 0, max: 80, step: 0.1 },
                  { id: 'irradiation', label: 'Irradiation (kW/m²)', min: 0, max: 1.5, step: 0.01 },
                  { id: 'hour', label: 'Hour', min: 0, max: 23, step: 1 },
                  { id: 'day', label: 'Day', min: 1, max: 31, step: 1 },
                  { id: 'month', label: 'Month', min: 1, max: 12, step: 1 },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-slate-400">{field.label}</label>
                      <span className="text-sm font-mono text-blue-300">
                        {(inputs as any)[field.id]}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={field.min} 
                      max={field.max} 
                      step={field.step}
                      value={(inputs as any)[field.id]}
                      onChange={(e) => setInputs({...inputs, [field.id]: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-semibold text-white shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Predicting...' : 'Predict Output'}
                </motion.button>
              </div>
            </div>

            {/* WEATHER CARD */}
            {weather && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-slate-400 text-sm">Current Weather</h3>
                  <div className="text-2xl font-bold mt-1">{weather.temperature}°C</div>
                </div>
                {weather.condition_code > 50 ? <CloudRain className="w-8 h-8 text-blue-400" /> : <Sun className="w-8 h-8 text-yellow-400" />}
              </motion.div>
            )}
          </div>

          {/* RIGHT PANEL - OUTPUTS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PREDICTION CARD */}
            <motion.div 
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center flex flex-col justify-center min-h-[200px]"
              whileHover={{ scale: 1.01, boxShadow: "0px 0px 30px rgba(59, 130, 246, 0.15)" }}
            >
              <h3 className="text-slate-400 text-lg mb-2">Predicted Power Output</h3>
              {prediction !== null ? (
                <motion.div 
                  key={prediction}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-emerald-600"
                >
                  {prediction.toFixed(2)} <span className="text-2xl text-slate-500">kW</span>
                </motion.div>
              ) : (
                <div className="text-4xl font-bold text-slate-600">-- kW</div>
              )}
            </motion.div>

            {/* GRAPHS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-[350px]">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2"/> Effect of Irradiation</h3>
                {curveData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curveData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="irradiation" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="power" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={false}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600">Click Predict to generate curve</div>
                )}
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-[350px]">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2"/> Actual vs Predicted (Test Data)</h3>
                {scatterData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="actual" type="number" name="Actual" stroke="#94a3b8" />
                      <YAxis dataKey="predicted" type="number" name="Predicted" stroke="#94a3b8" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      />
                      <Scatter name="Power" data={scatterData} fill="#8b5cf6" animationDuration={1000} />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600">Loading test data...</div>
                )}
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
