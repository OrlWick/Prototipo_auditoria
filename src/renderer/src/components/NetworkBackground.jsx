import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const NODES = [
  { x: 10, y: 20 }, { x: 28, y: 45 }, { x: 42, y: 12 }, { x: 55, y: 62 },
  { x: 68, y: 28 }, { x: 82, y: 48 }, { x: 92, y: 18 }, { x: 18, y: 72 },
  { x: 35, y: 82 }, { x: 52, y: 78 }, { x: 72, y: 72 }, { x: 88, y: 82 },
  { x: 5, y: 50 }, { x: 48, y: 45 }, { x: 95, y: 55 }, { x: 22, y: 90 },
  { x: 62, y: 90 }, { x: 78, y: 35 }, { x: 12, y: 5 }, { x: 75, y: 5 }
]

const EDGES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[6,0],[0,2],[1,3],[5,6],[7,8],
  [8,9],[9,10],[10,11],[7,1],[11,5],[3,9],[0,7],[2,6],[4,10],
  [8,1],[11,6],[12,0],[12,7],[13,1],[13,3],[13,9],[14,5],[14,11],
  [15,7],[15,8],[16,9],[16,10],[17,4],[17,14],[18,0],[18,12],[19,2],[19,6]
]

export default function NetworkBackground() {
  const lines = useMemo(() => {
    return EDGES.map(([i, j]) => {
      const from = NODES[i]
      const to = NODES[j]
      return { from, to }
    })
  }, [])

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2
      }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {lines.map((line, i) => (
        <motion.line
          key={`line-${i}`}
          x1={line.from.x}
          y1={line.from.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke="url(#lineGrad)"
          strokeWidth={0.15}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.15, 0.4, 0.15],
            transition: { duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }
          }}
        />
      ))}

      {NODES.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r={0.6}
          fill="var(--accent)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
            transition: { duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }
          }}
        />
      ))}
    </svg>
  )
}
