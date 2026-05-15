import React from 'react';
import { AlertTriangle, Bell, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlarmList = ({ alarms }) => {
  return (
    <div className="glass rounded-2xl flex flex-col h-full">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-industrial-cyan" size={18} />
          <h3 className="font-bold">Live Alarms</h3>
        </div>
        <span className="text-xs bg-industrial-800 px-2 py-1 rounded text-gray-400">
          {alarms.length} active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {alarms.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No active alarms. System normal.
            </div>
          ) : (
            alarms.map((alarm, idx) => (
              <motion.div
                key={`${alarm.timestamp}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3"
              >
                <div className="text-red-400 mt-1">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-red-200">{alarm.type}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(alarm.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-red-300/80 mt-1">{alarm.msg}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlarmList;
