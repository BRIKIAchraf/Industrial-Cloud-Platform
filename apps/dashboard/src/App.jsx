import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MachineCard from './components/MachineCard';
import AlarmList from './components/AlarmList';
import axios from 'axios';
import { Search, Bell, User, Filter, Download } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

function App() {
  const [machines, setMachines] = useState({});
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [monRes, alarmRes] = await Promise.all([
        axios.get(`${API_BASE}/monitoring/latest`),
        axios.get(`${API_BASE}/alarms`)
      ]);
      setMachines(monRes.data);
      setAlarms(alarmRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // 1s polling
    return () => clearInterval(interval);
  }, []);

  const handleCommand = async (machine_id, command) => {
    try {
      if (command === 'OTA_UPDATE') {
        await axios.post(`${API_BASE}/ota/update`, { machine_id, version: 'v1.4.2' });
      } else {
        await axios.post(`${API_BASE}/control`, { machine_id, command });
      }
    } catch (err) {
      console.error("Command error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-industrial-950 text-gray-200">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-industrial-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 bg-industrial-900 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search assets, sensors, tags..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-industrial-950" />
            </button>
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">Industrial Admin</p>
                <p className="text-[10px] text-gray-500 uppercase">Super User</p>
              </div>
              <div className="w-10 h-10 bg-industrial-700 rounded-full flex items-center justify-center border border-white/10">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1 grid grid-cols-12 gap-8 overflow-y-auto">
          
          <div className="col-span-12 flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-2">Operational Overview</h1>
              <p className="text-gray-500">Real-time status of all factory assets.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-industrial-800 px-4 py-2 rounded-lg border border-white/5 hover:border-industrial-cyan/50 transition-all text-sm">
                <Filter size={16} />
                Filters
              </button>
              <button className="flex items-center gap-2 bg-industrial-cyan text-black px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all text-sm">
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-4 gap-6 mb-4">
            <div className="glass p-4 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold">System Health</p>
              <p className="text-2xl font-black text-green-400">94.2%</p>
            </div>
            <div className="glass p-4 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold">OEE Score</p>
              <p className="text-2xl font-black text-industrial-cyan">88.5%</p>
            </div>
            <div className="glass p-4 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Active Alerts</p>
              <p className={`text-2xl font-black ${alarms.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {alarms.length}
              </p>
            </div>
            <div className="glass p-4 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Energy Cost</p>
              <p className="text-2xl font-black text-yellow-400">$1,240.20</p>
            </div>
          </div>

          {/* Machine Grid */}
          <div className="col-span-8 grid grid-cols-2 gap-6">
            {Object.values(machines).length > 0 ? (
              Object.values(machines).map((m) => (
                <MachineCard key={m.machine_id} machine={m} onCommand={handleCommand} />
              ))
            ) : (
              <div className="col-span-2 glass p-12 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                <Activity size={48} className="mb-4 animate-pulse" />
                <p>Waiting for telemetry data...</p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Alarms & Stats */}
          <div className="col-span-4 flex flex-col gap-6">
            <AlarmList alarms={alarms} />
            
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={18} />
                Energy Usage
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-mono font-black text-white">242.5</span>
                <span className="text-gray-500 font-bold mb-1">kWh</span>
              </div>
              <div className="w-full bg-industrial-800 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full w-2/3" />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">+12% from previous shift</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
