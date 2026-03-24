function Logo() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left pillar */}
      <path d="M14 12 L14 68" stroke="#a855f7" strokeWidth="8" strokeLinecap="round"/>
      {/* Right pillar */}
      <path d="M66 12 L66 68" stroke="#a855f7" strokeWidth="8" strokeLinecap="round"/>
      {/* Middle bar */}
      <path d="M14 40 L66 40" stroke="#a855f7" strokeWidth="8" strokeLinecap="round"/>
      {/* Left wing */}
      <path d="M14 40 C8 34 4 28 8 22" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Right wing */}
      <path d="M66 40 C72 34 76 28 72 22" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Compass needle up (white) */}
      <polygon points="40,18 44,38 40,34 36,38" fill="#ffffff"/>
      {/* Compass needle down (purple) */}
      <polygon points="40,62 44,42 40,46 36,42" fill="#a855f7" opacity="0.7"/>
      {/* Center dot */}
      <circle cx="40" cy="40" r="4" fill="#ffffff"/>
    </svg>
  )
}

export default Logo