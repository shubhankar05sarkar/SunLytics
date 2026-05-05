"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictPower, getTestData } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceDot, ReferenceLine, ComposedChart, Legend } from 'recharts';
import { Settings2, Activity, Loader2, AlertCircle, Info, Zap, Download, BarChart3 } from 'lucide-react';

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

  const [prediction, setPrediction] = useState<number | null>(null);
  const [curveData, setCurveData] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingScatter, setLoadingScatter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionKey, setPredictionKey] = useState(0);

  useEffect(() => {
    setLoadingScatter(true);
    getTestData(inputs.model_type).then(data => {
      setScatterData(data.scatter_data);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoadingScatter(false));
  }, [inputs.model_type]);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictPower(inputs);
      setPrediction(data.prediction);
      setCurveData(data.curve_data);
      setPredictionKey(prev => prev + 1);
    } catch (error: any) {
      setError(error?.response?.data?.detail?.error || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!prediction) return;
    
    const exportData = {
      parameters: inputs,
      prediction: prediction,
      impact_curve: curveData
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sunlytics_prediction.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const cardClass = "bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 rounded-3xl shadow-2xl shadow-blue-900/5 dark:shadow-black/40";

  return (
    <div className="relative min-h-screen w-full pb-10">
      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white drop-shadow-sm">Live Dashboard</h1>
          <p className="text-slate-700 dark:text-slate-300 mt-1 font-medium">Configure parameters and predict power output in real-time.</p>
        </div>
        <div className="flex items-center space-x-3">
          {prediction !== null && (
             <button onClick={handleExport} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/30 dark:border-slate-700/50 rounded-xl transition-colors shadow-lg font-semibold">
               <Download className="w-4 h-4" />
               <span className="hidden sm:inline">Export JSON</span>
             </button>
          )}
          <select 
            value={inputs.model_type}
            onChange={(e) => setInputs({...inputs, model_type: e.target.value})}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/30 dark:border-slate-700/50 text-slate-900 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 shadow-lg outline-none font-semibold cursor-pointer"
          >
            <option value="rf">Random Forest Model</option>
            <option value="lr">Linear Regression Model</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-50/90 dark:bg-red-900/40 backdrop-blur-md border border-red-200/50 dark:border-red-500/30 text-red-600 dark:text-red-300 px-4 py-3 rounded-2xl flex items-center shadow-lg font-medium">
            <AlertCircle className="w-5 h-5 mr-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* INPUTS */}
        <div className="xl:col-span-4 space-y-6">
          <div className={`${cardClass} p-8`}>
            <div className="flex items-center space-x-3 mb-8 text-slate-900 dark:text-white">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold">Parameters</h2>
            </div>
            <div className="space-y-7">
              {[
                { id: 'ambient_temperature', label: 'Ambient Temp (°C)', min: 0, max: 50, step: 0.1 },
                { id: 'module_temperature', label: 'Module Temp (°C)', min: 0, max: 80, step: 0.1 },
                { id: 'irradiation', label: 'Irradiation (kW/m²)', min: 0, max: 1.5, step: 0.01 },
                { id: 'hour', label: 'Hour of Day', min: 0, max: 23, step: 1 },
                { id: 'day', label: 'Day of Month', min: 1, max: 31, step: 1 },
                { id: 'month', label: 'Month', min: 1, max: 12, step: 1 },
              ].map((field) => (
                <div key={field.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{field.label}</label>
                    <span className="text-xs font-bold font-mono bg-blue-100/50 dark:bg-blue-900/40 px-2 py-1 rounded-md text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/30 dark:border-blue-800/30">
                      {(inputs as any)[field.id]}
                    </span>
                  </div>
                  <input 
                    type="range" min={field.min} max={field.max} step={field.step}
                    value={(inputs as any)[field.id]}
                    onChange={(e) => setInputs({...inputs, [field.id]: parseFloat(e.target.value)})}
                    className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-full appearance-none cursor-pointer accent-blue-600 backdrop-blur-sm"
                  />
                </div>
              ))}

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-4 mt-4 flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] rounded-2xl font-bold text-white shadow-xl shadow-blue-500/25 disabled:opacity-50 transition-all border border-blue-400/20"
              >
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : 'Generate Prediction'}
              </button>
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className={`${cardClass} p-8 flex flex-col justify-center items-center min-h-[220px] text-center relative overflow-hidden`}>
               {/* Decorative background glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
               
               <div className="p-4 bg-gradient-to-br from-blue-100/80 to-blue-50/50 dark:from-blue-900/50 dark:to-blue-800/20 backdrop-blur-md rounded-2xl mb-4 shadow-inner border border-blue-200/50 dark:border-blue-700/30">
                 <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
               </div>
               <h3 className="text-slate-700 dark:text-slate-300 font-bold mb-2">Predicted Power Output</h3>
               {loading ? (
                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin mt-4" />
               ) : prediction !== null ? (
                 <motion.div key={`pred-${predictionKey}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                   {prediction.toFixed(2)} <span className="text-2xl text-slate-500 dark:text-slate-400 font-bold">kW</span>
                 </motion.div>
               ) : (
                 <div className="text-4xl font-bold text-slate-300 dark:text-slate-600 mt-2">--</div>
               )}
             </div>
             
             {prediction !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${cardClass} p-8 flex flex-col justify-center`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Insights</h3>
                </div>
                <ul className="text-slate-800 dark:text-slate-200 space-y-4 font-semibold">
                  {inputs.irradiation > 0.8 ? (
                    <li className="flex items-start bg-green-500/10 dark:bg-green-500/10 p-3.5 rounded-xl border border-green-500/20 shadow-sm"><span className="text-green-600 dark:text-green-400 mr-3 font-black text-lg">↑</span> High irradiation is maximizing active power output.</li>
                  ) : (
                    <li className="flex items-start bg-amber-500/10 dark:bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 shadow-sm"><span className="text-amber-600 dark:text-amber-400 mr-3 font-black text-lg">↓</span> Low irradiation limits the overall generation capacity.</li>
                  )}
                  {inputs.module_temperature > 50 ? (
                    <li className="flex items-start bg-red-500/10 dark:bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 shadow-sm"><span className="text-red-600 dark:text-red-400 mr-3 font-black text-lg">⚠</span> Elevated module temperature may reduce panel efficiency.</li>
                  ) : (
                    <li className="flex items-start bg-green-500/10 dark:bg-green-500/10 p-3.5 rounded-xl border border-green-500/20 shadow-sm"><span className="text-green-600 dark:text-green-400 mr-3 font-black text-lg">✓</span> Temperature is within optimal operating range.</li>
                  )}
                </ul>
              </motion.div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${cardClass} h-[400px] flex flex-col`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-500"/> Effect of Irradiation</h3>
              <div className="flex-1 min-h-0 w-full relative">
                {curveData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curveData} key={`line-${predictionKey}`} margin={{ left: 0, bottom: 0, top: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-400/30 dark:text-slate-600/30" />
                      <XAxis dataKey="irradiation" type="number" domain={['dataMin', 'dataMax']} stroke="currentColor" className="text-slate-600 dark:text-slate-400 text-xs font-bold" tickMargin={10} />
                      <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 text-xs font-bold" tickMargin={10} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                        itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                      />
                      <Legend 
                        content={() => (
                          <div className="flex justify-center space-x-6 text-xs font-bold text-slate-400 pb-2">
                            <div className="flex items-center"><span className="w-4 h-1 bg-blue-500 rounded-full mr-2"></span>Prediction Curve</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Your Input</div>
                          </div>
                        )}
                        verticalAlign="top" height={36}
                      />
                      <Line name="Prediction Curve" type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={4} dot={{r: 0}} activeDot={{r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2}} animationDuration={1200} />
                      {prediction !== null && (
                        <>
                          <ReferenceLine x={inputs.irradiation} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" opacity={0.8} />
                          <ReferenceDot x={inputs.irradiation} y={prediction} r={7} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 font-bold">
                    <Activity className="w-10 h-10 mb-3 opacity-30" />
                    <p>Run a prediction to view</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${cardClass} h-[400px] flex flex-col`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-blue-500"/> Actual vs Predicted</h3>
              <div className="flex-1 min-h-0 w-full relative">
                {loadingScatter ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : scatterData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ left: 0, bottom: 0, top: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-400/30 dark:text-slate-600/30" />
                      <XAxis dataKey="actual" type="number" stroke="currentColor" className="text-slate-600 dark:text-slate-400 text-xs font-bold" tickMargin={10} domain={[0, 1400]} />
                      <YAxis dataKey="predicted" type="number" stroke="currentColor" className="text-slate-600 dark:text-slate-400 text-xs font-bold" tickMargin={10} domain={[0, 1400]} />
                      <RechartsTooltip 
                        cursor={{ strokeDasharray: '3 3', stroke: 'rgba(148, 163, 184, 0.5)' }} 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                      />
                      <Legend 
                        content={() => (
                          <div className="flex justify-center space-x-6 text-xs font-bold text-slate-400 pb-2">
                            <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Predicted vs Actual</div>
                            <div className="flex items-center"><span className="w-4 h-1 bg-red-500 rounded-full mr-2"></span>Perfect Prediction</div>
                            <div className="flex items-center"><span className="w-4 h-1 border-t-2 border-dashed border-red-500 mr-2"></span>Your Input</div>
                          </div>
                        )}
                        verticalAlign="top" height={36}
                      />
                      <Scatter name="Predicted vs Actual" data={scatterData} fill="#3b82f6" fillOpacity={0.7} animationDuration={1200} />
                      <Line name="Perfect Prediction" data={[{actual: 0, predicted: 0}, {actual: 1400, predicted: 1400}]} type="linear" dataKey="predicted" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
                      {prediction !== null && (
                        <ReferenceLine y={prediction} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" opacity={0.8} />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 font-bold">
                    <BarChart3 className="w-10 h-10 mb-3 opacity-30" />
                    <p>No validation data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
