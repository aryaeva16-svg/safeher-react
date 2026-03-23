function About() {
  return (
    <div className="about-section">
      <h2>About SafeHer</h2>
      <p>SafeHer is a women and child safety app designed to provide quick access to emergency helplines and send instant SOS alerts to your emergency contacts with your live location.</p>

      <div className="about-features">
        <div className="feature-card">
          <h3>🚨 SOS Alert</h3>
          <p>Press and hold the SOS button to alert your emergency contacts with your live location.</p>
        </div>
        <div className="feature-card">
          <h3>📞 Helplines</h3>
          <p>Quick access to all national emergency helpline numbers.</p>
        </div>
        <div className="feature-card">
          <h3>👥 Contacts</h3>
          <p>Save up to 5 emergency contacts who will be notified during an SOS alert.</p>
        </div>
      </div>
    </div>
  )
}

export default About