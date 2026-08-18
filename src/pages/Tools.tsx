import {
  Calculator,
  Calendar,
  Clock3,
  Dices,
  Percent,
  Scale,
} from 'lucide-react'

const tools = [
  {
    name: 'Calculator',
    description: 'Everyday calculations',
    icon: Calculator,
  },
  {
    name: 'Percentage',
    description: 'Calculate percentages',
    icon: Percent,
  },
  {
    name: 'Date calculator',
    description: 'Dates & durations',
    icon: Calendar,
  },
  {
    name: 'Countdown',
    description: 'Count down to anything',
    icon: Clock3,
  },
  {
    name: 'Unit converter',
    description: 'Convert common units',
    icon: Scale,
  },
  {
    name: 'Random picker',
    description: 'Let NOVA decide',
    icon: Dices,
  },
]

function Tools() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">EVERYDAY UTILITY</p>
          <h1>Tools</h1>
        </div>
      </header>

      <p className="page-description">
        Small tools for everyday problems.
      </p>

      <div className="tools-grid">
        {tools.map((tool) => {
          const Icon = tool.icon

          return (
            <button className="tool-card" key={tool.name}>
              <div className="tool-icon">
                <Icon size={20} />
              </div>

              <strong>{tool.name}</strong>

              <span>{tool.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Tools