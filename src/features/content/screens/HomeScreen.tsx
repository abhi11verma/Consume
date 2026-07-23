import { motion } from 'framer-motion'
import { useContentStore } from '../store/contentStore'
import { CategorySection } from '../components/rows/CategorySection'
import { NewsLayout } from '../components/NewsLayout'
import { CONTENT_TYPE_ORDER } from '../constants'

export function HomeScreen() {
  const items = useContentStore((s) => s.items)
  const hasAny = items.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="px-8 py-8"
    >
      {!hasAny ? (
        <EmptyDashboard />
      ) : (
        <>
          {CONTENT_TYPE_ORDER.map((type) => {
            const typeItems = items.filter((i) => i.type === type)
            if (typeItems.length === 0) return null

            if (type === 'news') {
              return <NewsLayout key={type} items={typeItems} />
            }

            return <CategorySection key={type} type={type} items={typeItems} />
          })}
        </>
      )}
    </motion.div>
  )
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="text-6xl select-none">📚</div>
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
          Your library is empty
        </h2>
        <p className="text-[var(--color-muted)] max-w-sm leading-relaxed">
          Start capturing content by clicking the{' '}
          <span className="font-semibold text-[var(--color-accent)]">+</span> button.
          Paste any URL and Consume will save it beautifully.
        </p>
      </div>
    </div>
  )
}
