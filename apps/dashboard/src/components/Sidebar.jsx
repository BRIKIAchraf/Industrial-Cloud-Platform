import React from 'react';
import { LayoutDashboard, Database, Shield, Settings, Factory, Zap, Activity } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Factory size={20} />, label: 'Factories' },
    { icon: <Activity size={20} />, label: 'Analytics' },
    { icon: <Database size={20} />, label: 'Data Logs' },
    { icon: <Shield size={20} />, label: 'Security' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-64 glass border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-industrial-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Zap className="text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter">INDUS-X</span>
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              item.active 
                ? 'bg-industrial-cyan text-black font-bold' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-industrial-800 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-300">Cloud Connected</span>
          </div>
          <p className="text-[10px] text-gray-500">Latency: 12ms</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
