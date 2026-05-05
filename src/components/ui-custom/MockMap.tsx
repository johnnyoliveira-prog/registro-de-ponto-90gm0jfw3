import React from 'react'
import { cn } from '@/lib/utils'

export interface MapMarker {
  id: string
  x: number // 0-100 percentage
  y: number // 0-100 percentage
  color?: string
  icon?: React.ReactNode
  label?: string
  pulse?: boolean
}

export interface MapPath {
  id: string
  points: { x: number; y: number }[]
  color?: string
}

interface MockMapProps {
  markers?: MapMarker[]
  paths?: MapPath[]
  className?: string
  mapStyle?: 'default' | 'silver'
}

export function MockMap({
  markers = [],
  paths = [],
  className,
  mapStyle = 'silver',
}: MockMapProps) {
  // Use a placeholder image that looks like a map
  const bgUrl = `https://img.usecurling.com/p/1200/800?q=street%20map&color=${mapStyle === 'silver' ? 'gray' : 'cyan'}`

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-slate-200 rounded-xl border border-border',
        className,
      )}
    >
      <img
        src={bgUrl}
        alt="Map background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Draw paths using SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {paths.map((path) => {
          const pointsStr = path.points.map((p) => `${p.x}%,${p.y}%`).join(' ')
          return (
            <polyline
              key={path.id}
              points={pointsStr}
              fill="none"
              stroke={path.color || '#4F46E5'}
              strokeWidth="3"
              strokeDasharray="5, 5"
              className="opacity-70 animate-pulse"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* Draw markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.pulse && (
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring opacity-50 pointer-events-none"
              style={{ backgroundColor: marker.color || '#10B981' }}
            />
          )}
          <div
            className="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"
            style={{ backgroundColor: marker.color || '#4F46E5' }}
          >
            {marker.icon}
          </div>
          {marker.label && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              {marker.label}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
