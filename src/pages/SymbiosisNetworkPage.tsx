import React, { useState } from 'react';
import { mockSymbiosisNodes, mockSymbiosisLinks } from '../mocks/fixtures';
import { useTranslation } from '../i18n/translations';
import {
  Network,
  Recycle,
  Sparkles,
  Info,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SymbiosisNetworkPage: React.FC = () => {
  const { formatNumber, formatCurrency } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<string | null>('sugar');
  const [activeSector, setActiveSector] = useState<string>('All');

  const nodes = mockSymbiosisNodes;
  const links = mockSymbiosisLinks;

  const sectors = ['All', 'Sugar & Agro', 'Paper', 'Power', 'Cement', 'Bio-Fuels'];

  const filteredLinks = links.filter((l) => {
    if (activeSector === 'All') return true;
    const sourceNode = nodes.find((n) => n.id === l.source);
    const targetNode = nodes.find((n) => n.id === l.target);
    return sourceNode?.sector === activeSector || targetNode?.sector === activeSector;
  });

  const currentNodeObj = nodes.find((n) => n.id === selectedNode);
  const connectedLinks = links.filter((l) => l.source === selectedNode || l.target === selectedNode);

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-white">
          Regional Industrial Symbiosis Graph
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Interactive material and energy symbiosis topology connecting production clusters across Tamil Nadu
        </p>
      </div>

      {/* Filter Sector Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-stone-500">Filter Corridor:</span>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSector(sec)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeSector === sec
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Interactive Canvas Graph & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Canvas */}
        <div className="lg:col-span-2 relative h-[520px] bg-slate-950 rounded-3xl overflow-hidden border border-stone-800 shadow-xl p-4">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 45%, #020617 100%)',
            }}
          />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {filteredLinks.map((l) => {
              const src = nodes.find((n) => n.id === l.source);
              const tgt = nodes.find((n) => n.id === l.target);
              if (!src || !tgt) return null;

              const isHighlighted = selectedNode === l.source || selectedNode === l.target;

              return (
                <g key={l.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? '#fbbf24' : '#10b981'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? '6 3' : 'none'}
                    className={isHighlighted ? 'animate-pulse' : ''}
                    opacity={isHighlighted ? 1 : 0.45}
                  />
                  {/* Midpoint material badge */}
                  <circle
                    cx={(src.x + tgt.x) / 2}
                    cy={(src.y + tgt.y) / 2}
                    r={3}
                    fill={isHighlighted ? '#fbbf24' : '#34d399'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Cluster Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{ top: `${node.y}px`, left: `${node.x}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition group"
              >
                <div
                  className={`p-3 rounded-2xl border text-center transition duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 border-white ring-4 ring-amber-400/40 scale-110 font-bold'
                      : 'bg-stone-900/90 text-white border-emerald-500/40 hover:border-emerald-400'
                  }`}
                >
                  <span className="text-[11px] font-bold block max-w-[130px] leading-tight">
                    {node.name}
                  </span>
                  <span className="text-[9px] opacity-80 uppercase tracking-wider block mt-0.5">
                    {node.sector}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-4 text-[11px] text-emerald-300/80 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
            Click any industrial cluster node to inspect annual material exchanges and Scope 3 carbon savings
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          {currentNodeObj ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {currentNodeObj.sector} Cluster
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white mt-0.5">
                  {currentNodeObj.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Regional District: {currentNodeObj.district}, Tamil Nadu
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Network Role:</span>
                  <span className="font-bold text-stone-900 dark:text-white capitalize">
                    {currentNodeObj.type === 'both' ? 'Feedstock Producer & Consumer' : `${currentNodeObj.type} Hub`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Active Material Links:</span>
                  <span className="font-bold text-emerald-700">{connectedLinks.length} Connections</span>
                </div>
              </div>

              {/* Connected Streams list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Material Exchanges:
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {connectedLinks.map((link) => {
                    const isSource = link.source === currentNodeObj.id;
                    const counterpart = nodes.find((n) => n.id === (isSource ? link.target : link.source));

                    return (
                      <div
                        key={link.id}
                        className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold">
                          <span className="text-emerald-700 dark:text-emerald-400">{link.material}</span>
                          <span className="text-stone-900 dark:text-white">{formatNumber(link.annualVolumeTons)} MT/yr</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {isSource ? 'Supplied to: ' : 'Received from: '}
                          <strong>{counterpart?.name}</strong>
                        </p>
                        <div className="flex justify-between text-[10px] text-teal-600 font-semibold pt-1 border-t border-stone-200 dark:border-stone-700">
                          <span>Carbon Saved:</span>
                          <span>{formatNumber(link.co2SavedAnnualTons)} tCO2e/yr</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500">Select a cluster on the network canvas.</p>
          )}

          <div className="pt-2">
            <button
              onClick={() => setSelectedNode('power')}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Highlight Thermal Power Fly Ash Loops
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
