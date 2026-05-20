"use client";

import { motion } from "framer-motion";

export function ToothAnimation() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
        <defs>
          <radialGradient id="tg" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#e0f9f9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a0e4e8" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="shine" cx="32%" cy="25%" r="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ec6c6" stopOpacity="0" />
            <stop offset="45%" stopColor="#0ec6c6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0ec6c6" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#0ec6c6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ec6c6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowStrong" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="toothClip">
            <path d="M160,22 C114,22 84,46 82,76 C80,104 89,138 98,166 C104,183 113,191 126,183 C136,176 141,160 160,160 C179,160 184,176 194,183 C207,191 216,183 222,166 C231,138 240,104 238,76 C236,46 206,22 160,22 Z" />
          </clipPath>
        </defs>

        <g transform="translate(0, 20)">
          {/* Shadow bawah */}
          <ellipse cx="160" cy="210" rx="65" ry="14" fill="#0ec6c6" opacity="0.1">
            <animate attributeName="opacity" values="0.07;0.16;0.07" dur="3s" repeatCount="indefinite" />
            <animate attributeName="rx" values="65;72;65" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Tooth body */}
          <motion.path
            d="M160,22 C114,22 84,46 82,76 C80,104 89,138 98,166 C104,183 113,191 126,183 C136,176 141,160 160,160 C179,160 184,176 194,183 C207,191 216,183 222,166 C231,138 240,104 238,76 C236,46 206,22 160,22 Z"
            fill="url(#tg)"
            stroke="#22d3ee"
            strokeWidth="2.2"
            animate={{ scale: [1, 1.022, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "160px 106px" }}
          />

          {/* Shine */}
          <motion.path
            d="M160,22 C114,22 84,46 82,76 C80,104 89,138 98,166 C104,183 113,191 126,183 C136,176 141,160 160,160 C179,160 184,176 194,183 C207,191 216,183 222,166 C231,138 240,104 238,76 C236,46 206,22 160,22 Z"
            fill="url(#shine)"
            animate={{ scale: [1, 1.022, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "160px 106px" }}
          />

          {/* Highlight stroke atas */}
          <path d="M125,52 Q145,40 165,38 Q182,40 198,52" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeOpacity="0.55" strokeLinecap="round" />
          <path d="M112,70 Q126,58 142,55" stroke="#ffffff" strokeWidth="2" fill="none" strokeOpacity="0.35" strokeLinecap="round" />

          {/* Garis gusi */}
          <line x1="82" y1="172" x2="238" y2="172" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.45" />

          {/* Kontur dalam */}
          <path d="M108,108 Q130,122 160,119 Q190,122 212,108" stroke="#22d3ee" strokeWidth="1.2" fill="none" strokeOpacity="0.3" strokeDasharray="5 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.8s" repeatCount="indefinite" />
          </path>

          {/* Scan line - FULL WIDTH */}
          <motion.rect
            x="-50" y="-20" width="420" height="20"
            fill="url(#scanGrad)"
            animate={{ y: [-20, 260, -20] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            opacity="1"
          />

          {/* === MARKER KARIES (amber) === */}
          {/* Ripple */}
          <circle cx="118" cy="82" r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6">
            <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Dot */}
          <motion.circle
            cx="118" cy="82" r="7"
            fill="#f59e0b"
            filter="url(#glow)"
            animate={{ r: [7, 9, 7], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="118" cy="82" r="4" fill="#fbbf24" />
          {/* Dashed line */}
          <line x1="112" y1="77" x2="66" y2="52" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="4 3" strokeOpacity="0.9">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1s" repeatCount="indefinite" />
          </line>
          {/* Badge */}
          <motion.g
            filter="url(#glow)"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="22" y="36" width="46" height="26" rx="7" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="45" y="48" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="#92400e">Karies</text>
            <text x="45" y="59" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fill="#b45309">82%</text>
          </motion.g>

          {/* === MARKER KARANG (red) === */}
          {/* Ripple */}
          <circle cx="195" cy="96" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6">
            <animate attributeName="r" values="8;20;8" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Dot */}
          <motion.circle
            cx="195" cy="96" r="7"
            fill="#ef4444"
            filter="url(#glow)"
            animate={{ r: [7, 9, 7], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="195" cy="96" r="4" fill="#f87171" />
          {/* Dashed line */}
          <line x1="202" y1="91" x2="252" y2="64" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="4 3" strokeOpacity="0.9">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1s" repeatCount="indefinite" />
          </line>
          {/* Badge */}
          <motion.g
            filter="url(#glow)"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="252" y="48" width="48" height="26" rx="7" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
            <text x="276" y="60" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="#991b1b">Karang</text>
            <text x="276" y="71" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fill="#b91c1c">67%</text>
          </motion.g>

          {/* === MARKER SEHAT (green) === */}
          {/* Ripple */}
          <circle cx="160" cy="65" r="5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6">
            <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Dot */}
          <motion.circle
            cx="160" cy="65" r="7"
            fill="#10b981"
            filter="url(#glow)"
            animate={{ r: [7, 9, 7], opacity: [1, 0.6, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="160" cy="65" r="4" fill="#34d399" />
          {/* Dashed line */}
          <line x1="160" y1="60" x2="200" y2="5" stroke="#10b981" strokeWidth="1.3" strokeDasharray="4 3" strokeOpacity="0.9">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1s" repeatCount="indefinite" />
          </line>
          {/* Badge */}
          <motion.g
            filter="url(#glow)"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="200" y="-8" width="60" height="26" rx="7" fill="#dcfce7" stroke="#10b981" strokeWidth="1.2" />
            <text x="230" y="4" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="#15803d">Sehat</text>
            <text x="230" y="15" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fill="#22c55e">78%</text>
          </motion.g>

          {/* Partikel cyan floating */}
          {[
            { cx: 100, cy: 230, dur: "3s", r: 2.5 },
            { cx: 135, cy: 242, dur: "4s", r: 1.8 },
            { cx: 160, cy: 236, dur: "3.5s", r: 2 },
            { cx: 190, cy: 240, dur: "2.8s", r: 2.2 },
            { cx: 220, cy: 228, dur: "3.8s", r: 1.6 },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#22d3ee" opacity="0.5">
              <animate attributeName="cy" values={`${p.cy};${p.cy - 18};${p.cy}`} dur={p.dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur={p.dur} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Endpoint garis gusi */}
          <circle cx="82" cy="172" r="3.5" fill="#22d3ee" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="238" cy="172" r="3.5" fill="#22d3ee" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    );
}
