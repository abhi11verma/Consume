import type { LucideIcon } from 'lucide-react'

interface GeneratedThumbnailProps {
  title: string
  domain: string
  accentColor: string
  Icon: LucideIcon
  variant?: 'landscape' | 'portrait'
}

export function GeneratedThumbnail({
  title,
  domain,
  accentColor,
  Icon,
  variant = 'landscape',
}: GeneratedThumbnailProps) {
  const isPortrait = variant === 'portrait'

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden select-none"
      style={{
        background: `linear-gradient(
          145deg,
          color-mix(in srgb, ${accentColor} 24%, var(--color-card)) 0%,
          color-mix(in srgb, ${accentColor} 8%, var(--color-card)) 100%
        )`,
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Accent bar */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: accentColor }} />

      {/* Content */}
      <div className="relative flex flex-col h-full p-4 pt-5 gap-3">
        {/* Icon chip */}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0 self-start"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          <Icon size={15} style={{ color: accentColor }} />
        </div>

        {/* Title — grows to fill space */}
        <p
          className="flex-1 font-bold text-[var(--color-foreground)] leading-snug"
          style={{
            fontSize: isPortrait ? '0.95rem' : '0.82rem',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isPortrait ? 7 : 4,
            overflow: 'hidden',
          }}
        >
          {title}
        </p>

        {/* Domain tag */}
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full self-start shrink-0"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {domain}
        </span>
      </div>
    </div>
  )
}
