import { useEffect, useState } from "react"
import ContactForm from './ContactForm'
import ContactCard from "./ContactCard"

function ContactSection() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const response = await fetch('https://safeher-backend-h5mm.onrender.com/contacts')
      const data = await response.json()
      if(data.success) {
        setContacts(data.contacts)
        localStorage.setItem('emergencyContacts', JSON.stringify(data.contacts))
      }
    } catch(error) {
      console.log('Backend unavailable, using localStorage')
      const saved = JSON.parse(localStorage.getItem('emergencyContacts')) || []
      setContacts(saved)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacts" className="contacts-section">
      <h2>My Emergency Contacts</h2>

      <ContactForm
        contacts={contacts}
        setContacts={setContacts}
      />

      <p className="contact-counter"
        style={{ color: contacts.length >= 5 ? '#ff4d6d' : '#4A90D9' }}
      >
        Emergency Contacts: {contacts.length}/5
      </p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>
          Loading contacts...
        </p>
      ) : contacts.length === 0 ? (
        <p className="no-contacts">
          No emergency contacts added yet.
        </p>
      ) : (
        contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            contacts={contacts}
            setContacts={setContacts}
          />
        ))
      )}
    </section>
  )
}

export default ContactSection