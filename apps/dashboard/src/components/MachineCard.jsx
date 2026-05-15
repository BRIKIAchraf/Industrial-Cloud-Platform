import React from 'react';
import { Activity, Power, Thermometer, Gauge, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MachineCard = ({ machine, onCommand }) => {
  const isRunning = machine.status === 'RUNNING';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-hover p-6 rounded-2xl flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{machine.name}</h3>
          <span className="text-xs text-gray-400 font-mono">{machine.machine_id}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
          isRunning ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          {machine.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="col-span-2 mb-2">
           <div className="flex justify-between items-end mb-1">
             <span className="text-[10px] uppercase text-gray-500 font-bold">Predictive Health</span>
             <span className={`text-xs font-bold ${machine.health_score > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
               {machine.health_score}%
             </span>
           </div>
           <div className="w-full bg-industrial-800 h-1.5 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-500 ${machine.health_score > 70 ? 'bg-green-400' : 'bg-yellow-400'}`} 
               style={{ width: `${machine.health_score}%` }} 
             />
           </div>
        </div>
        {Object.entries(machine.metrics).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-500 font-bold">{key}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono text-industrial-cyan">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-auto">
        <button 
          onClick={() => onCommand(machine.machine_id, isRunning ? 'STOP' : 'START')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
            isRunning 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          <Power size={16} />
          {isRunning ? 'STOP' : 'START'}
        </button>
        <button 
          onClick={() => onCommand(machine.machine_id, 'RESET')}
          className="px-4 py-2 bg-industrial-700 text-gray-300 rounded-lg hover:bg-industrial-600 transition-all text-xs"
        >
          RESET
        </button>
        <button 
          onClick={() => onCommand(machine.machine_id, 'OTA_UPDATE')}
          className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-xs"
        >
          OTA
        </button>
      </div>
    </motion.div>
  );
};

export default MachineCard;
