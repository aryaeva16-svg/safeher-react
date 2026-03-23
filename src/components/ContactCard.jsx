function ContactCard({ contact, contacts, setContacts }) {

  async function deleteContact() {
    const confirmed = confirm(`Are you sure you want to delete ${contact.name}?`)

    if(confirmed) {
      try {
        // Delete from backend which deletes from Firebase
        const response = await fetch(`https://safeher-backend-h5mm.onrender.com/contacts/${contact.id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if(data.success) {
          const updatedContacts = contacts.filter((c) => c.id !== contact.id)
          setContacts(updatedContacts)
          localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
        } else {
          alert('Failed to delete contact. Please try again.')
        }
      } catch(error) {
        // Fallback — delete from local state if backend is down
        const updatedContacts = contacts.filter((c) => c.id !== contact.id)
        setContacts(updatedContacts)
        localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
      }
    }
  }

  return (
    <div className="contact-card">
      <div className="contact-info">
        <span className="contact-name">👤 {contact.name}</span>
        <span className="contact-phone">📞 {contact.phone}</span>
      </div>
      <button className="delete-btn" onClick={() => deleteContact()}>
        🗑️ Delete
      </button>
    </div>
  )
}

export default ContactCard