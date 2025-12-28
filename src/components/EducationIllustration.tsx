export const EducationIllustration = () => (
  <svg
    viewBox="0 0 600 600"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Background shapes */}
    <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.1" />
    <circle cx="500" cy="500" r="100" fill="url(#grad1)" opacity="0.1" />
    
    {/* Book/Education icon */}
    <path
      d="M300 150 L200 200 L300 250 L400 200 Z"
      fill="url(#grad1)"
      opacity="0.8"
    />
    <path
      d="M200 200 L200 400 L300 450 L300 250 Z"
      fill="url(#grad1)"
      opacity="0.6"
    />
    <path
      d="M300 250 L300 450 L400 400 L400 200 Z"
      fill="url(#grad1)"
      opacity="0.4"
    />
    
    {/* Graduation cap */}
    <path
      d="M250 180 L350 180 L350 200 L300 220 L250 200 Z"
      fill="#3B82F6"
    />
    <circle cx="300" cy="200" r="20" fill="#8B5CF6" opacity="0.3" />
    
    {/* Stars/achievements */}
    <path
      d="M150 300 L155 310 L165 310 L157 317 L160 327 L150 322 L140 327 L143 317 L135 310 L145 310 Z"
      fill="#FBBF24"
    />
    <path
      d="M450 350 L453 357 L460 357 L455 362 L458 369 L450 365 L442 369 L445 362 L440 357 L447 357 Z"
      fill="#FBBF24"
    />
  </svg>
)
