import React from 'react';
import { CONTEXTS } from '../constants';
import { ContextType } from '../types';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';

interface SidebarProps {
  activeContext: ContextType;
  onContextChange: (context: ContextType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeContext, onContextChange, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-warm-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed md:relative w-72 h-full bg-warm-100 border-r border-warm-200 flex flex-col p-6 gap-8 z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-warm-800">Reminisce</h1>
            <p className="text-xs uppercase tracking-widest font-semibold text-warm-500 opacity-70">Note Taker</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-warm-500 hover:bg-warm-200 rounded-xl md:hidden"
          >
            <Icons.X size={24} />
          </button>
        </div>

      <nav className="flex flex-col gap-2">
        {CONTEXTS.map((ctx) => {
          const IconComponent = (Icons as any)[ctx.icon];
          const isActive = activeContext === ctx.id;

          return (
            <button
              key={ctx.id}
              onClick={() => {
                onContextChange(ctx.id);
                onClose();
              }}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 text-left",
                isActive 
                  ? "bg-warm-400 text-white shadow-md scale-[1.02]" 
                  : "hover:bg-warm-200 text-warm-700"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-white/20" : "bg-warm-300/30 group-hover:bg-warm-300/50"
              )}>
                {IconComponent && <IconComponent size={18} />}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{ctx.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-warm-200">
        <div className="p-4 rounded-2xl bg-warm-200/50 border border-warm-300/50">
          <p className="text-[10px] uppercase tracking-wider font-bold text-warm-600 mb-1">Tip</p>
          <p className="text-xs text-warm-700 leading-relaxed italic">
            "The palest ink is better than the best memory."
          </p>
        </div>
      </div>
      </div>
    </>
  );
};
