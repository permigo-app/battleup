export default function LogoIcon({ size = 28, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block', ...style }}
    >
      <rect width="100" height="100" rx="22" fill="#8B5CF6"/>
      <polygon points="58,10 35,52 50,52 42,90 68,45 52,45" fill="white"/>
    </svg>
  )
}
