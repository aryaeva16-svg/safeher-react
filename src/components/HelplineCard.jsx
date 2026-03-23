function HelplineCard({ name, number, icon, desc }) {
  return (
    <div className="helpline-card">
      <div className="icon">{icon}</div>
      <h3>{name}</h3>
      <div className="number">{number}</div>
      <p>{desc}</p>
      <a href={`tel:${number}`}>
        <button className="call-btn">📞 Call Now</button>
      </a>
    </div>
  )
}

export default HelplineCard