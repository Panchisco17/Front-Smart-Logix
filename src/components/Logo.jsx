// Logo minimalista de SmartLogix: un monograma "SLX" dentro de una placa
// redondeada con degradado indigo -> violeta, y un acento diagonal que
// sugiere movimiento/logística. `variant="icon"` devuelve solo la marca
// (para el favicon o espacios chicos); `variant="full"` agrega el wordmark.
function Logo({ variant = "full", size = 40, className = "" }) {
    const mark = (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="slx-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx="11" fill="url(#slx-grad)" />
            <path d="M0 27 L15 11 L21 11 L6 27 Z" fill="#ffffff" fillOpacity="0.14" />
            <text
                x="20"
                y="27.5"
                textAnchor="middle"
                fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
                fontWeight="800"
                fontSize="15.5"
                letterSpacing="-0.5"
                fill="#ffffff"
            >
                SLX
            </text>
        </svg>
    );

    if (variant === "icon") {
        return <span className={className}>{mark}</span>;
    }

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {mark}
            <div className="leading-none">
                <p className="font-extrabold tracking-tight text-lg" style={{ letterSpacing: "-0.02em" }}>
                    Smart<span className="text-indigo-400">Logix</span>
                </p>
            </div>
        </div>
    );
}

export default Logo;
