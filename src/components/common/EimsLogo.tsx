
const EimsLogo = ({ className = 'h-12 w-auto' }) => {
  return (
    <svg 
      viewBox="0 0 300 300" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c7d2fe', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0.6 }} />
        </linearGradient>
      </defs>

      {/* Main container with dynamic shape */}
      <path 
        d="M 50,100 L 250,100 L 230,200 Q 150,220 70,200 Z" 
        fill="url(#techGradient)" 
      />

      {/* Digital circuit lines */}
      <g stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round">
        <path d="M 70,150 L 100,150 L 100,170 L 130,170" fill="none" />
        <path d="M 140,130 L 160,130 L 160,150 L 190,150" fill="none" />
        <path d="M 170,180 L 200,180 L 200,160" fill="none" />
        <circle cx="130" cy="170" r="3" fill="#a5f3fc" />
        <circle cx="190" cy="150" r="3" fill="#a5f3fc" />
        <circle cx="200" cy="160" r="3" fill="#a5f3fc" />
      </g>

      {/* Modern dots pattern */}
      <g fill="#ffffff" fillOpacity="0.3">
        <circle cx="80" cy="130" r="2" />
        <circle cx="100" cy="140" r="2" />
        <circle cx="120" cy="120" r="2" />
        <circle cx="200" cy="130" r="2" />
        <circle cx="220" cy="140" r="2" />
        <circle cx="180" cy="120" r="2" />
      </g>

      {/* System name with modern font */}
      <text 
        x="150" 
        y="250" 
        textAnchor="middle" 
        fill="#1e40af" 
        fontFamily="Arial, sans-serif" 
        fontSize="48" 
        fontWeight="bold"
      >
        EIMS
      </text>
    </svg>
  );
};

export default EimsLogo;