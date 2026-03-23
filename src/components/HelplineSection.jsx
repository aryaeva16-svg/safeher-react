import HelplineCard from './HelplineCard'

const helplines = [
  {
    id: 1,
    name: "Women Helpline",
    number: "1091",
    icon: "♀",
    desc: "24/7 national women distress helpline"
  },
  {
    id: 2,
    name: "Child Helpline",
    number: "1098",
    icon: "🧒",
    desc: "CHILDLINE India — children in crisis"
  },
  {
    id: 3,
    name: "Police",
    number: "100",
    icon: "🚔",
    desc: "Immediate police assistance"
  },
  {
    id: 4,
    name: "Ambulance",
    number: "108",
    icon: "🚑",
    desc: "Emergency medical services"
  },
  {
    id: 5,
    name: "Domestic Violence",
    number: "181",
    icon: "🏠",
    desc: "Domestic violence helpline"
  },
  {
    id: 6,
    name: "Anti Stalking",
    number: "1096",
    icon: "🛡️",
    desc: "Cyber crime and stalking helpline"
  },
  {
    id: 7,
    name: "Missing Child",
    number: "1094",
    icon: "🔍",
    desc: "Missing child and women helpline"
  },
  {
    id: 8,
    name: "Disaster Relief",
    number: "1077",
    icon: "⚡",
    desc: "National disaster management"
  },
  {
    id: 9,
    name: "Mental Health",
    number: "1800-599-0019",
    icon: "🧠",
    desc: "Government mental health support"
  }
]


function HelplineSection() {
  return (
    <section id="helplines" className="helplines-section">
      <h2>Emergency Helplines</h2>
      <div className="helplines-grid">
        {helplines.map((helpline) => (
            <HelplineCard
              key={helpline.id}
              name={helpline.name}
              number={helpline.number}
              icon={helpline.icon}
              desc={helpline.desc}
            />
          ))}
      </div>
    </section>
  )
}

export default HelplineSection