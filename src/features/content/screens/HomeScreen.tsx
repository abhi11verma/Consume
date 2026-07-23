import { motion } from 'framer-motion'
import { useContentStore } from '../store/contentStore'
import { useCategoryStore } from '../store/categoryStore'
import { CategorySection } from '../components/rows/CategorySection'

export function HomeScreen() {
  const items = useContentStore((s) => s.items)
  const categories = useCategoryStore((s) => s.categories)
  const hasAny = items.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-4 md:px-8 md:py-8"
    >
      {!hasAny ? (
        <EmptyDashboard />
      ) : (
        <>
          {categories.map((cat) => {
            const typeItems = items.filter((i) => i.type === cat.slug)
            if (typeItems.length === 0) return null
            return <CategorySection key={cat.slug} category={cat} items={typeItems} />
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
