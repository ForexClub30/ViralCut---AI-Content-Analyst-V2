import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ClipMetadata, ChartDataPoint } from '../types';

interface ViralChartProps {
  clips: ClipMetadata[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded shadow-xl">
        <p className="text-zinc-200 font-bold mb-1">{`Time: ${label}`}</p>
        <p className="text-purple-400 text-sm">{`Score: ${payload[0].value}/10`}</p>
        <p className="text-zinc-400 text-xs italic">{payload[0].payload.category}</p>
      </div>
    );
  }
  return null;
};

const ViralChart: React.FC<ViralChartProps> = ({ clips }) => {
  const data: ChartDataPoint[] = clips.map((clip) => ({
    time: clip.start_time,
    score: clip.viral_score,
    category: clip.category[0] || 'Viral',
  }));

  return (
    <div className="h-64 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Viral Intensity Map</h3>
        <span className="text-xs text-zinc-600">Score vs. Timestamp</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis 
            dataKey="time" 
            stroke="#71717a" 
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            stroke="#71717a" 
            fontSize={12} 
            domain={[0, 10]} 
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Viral Threshold", fill: '#ef4444', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViralChart;