interface SectionTitleProps {
  subtitle?: string
  title: string
  description?: string
  centered?: boolean
  light?: boolean
}

export default function SectionTitle({ subtitle, title, description, centered = true, light }: SectionTitleProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <span className={`inline-block text-sm font-semibold uppercase tracking-wider mb-3
          ${light ? 'text-primary-300' : 'text-primary-600'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg max-w-2xl ${centered ? 'mx-auto' : ''}
          ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>
      )}
      <div className={`mt-6 h-1 w-16 rounded-full bg-accent-500 ${centered ? 'mx-auto' : ''}`} />
    </div>
  )
}
