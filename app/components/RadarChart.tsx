'use client'

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PolarRadiusAxis
} from 'recharts'

interface RadarChartProps {
  data: Array<{
    universe: string
    [key: string]: string | number
  }>
  profiles: readonly string[]
}

const COLORS = [
  '#FF6B6B',  // Rouge vif
  '#4ECDC4',  // Turquoise
  '#45B7D1',  // Bleu clair
  '#96CEB4',  // Vert menthe
]

export function RadarChart({ data, profiles }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid gridType="circle" />
        <PolarAngleAxis
          dataKey="universe"
          tick={{ 
            fill: '#64748b', 
            fontSize: 12,
            dy: 5
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ 
            fill: '#64748b',
            fontSize: 10
          }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value: number) => [`${value}%`, '']}
        />
        
        {profiles.map((profile, index) => (
          <Radar
            key={profile}
            name={profile}
            dataKey={profile}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.2}
          />
        ))}
        
        <Legend 
          wrapperStyle={{
            paddingTop: '20px'
          }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
} 