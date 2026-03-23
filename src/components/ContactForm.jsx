import { useState } from 'react'

function ContactForm({ contacts, setContacts }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function addContact() {
    console.log('addContact called')

    if(name.trim() === '' || phone.trim() === '') {
      alert('⚠️ Please enter both name and phone number!')
      return
    }

    if(phone.trim().length < 10) {
      alert('⚠️ Please enter a valid phone number!')
      return
    }

    if(contacts.length >= 5) {
      alert('⚠️ Maximum 5 emergency contacts allowed!')
      return
    }

    try {
      setLoading(true)
      console.log('Sending to backend...')

      const response = await fetch('https://safeher-backend-h5mm.onrender.com/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim()
        })
      })

      const data = await response.json()
      console.log('Backend response:', data)

      if(data.success) {
        const newContact = {
          id: data.id,
          name: name.trim(),
          phone: phone.trim()
        }
        const updatedContacts = [...contacts, newContact]
        setContacts(updatedContacts)
        localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
        setName('')
        setPhone('')
        console.log('Contact saved successfully!')
      } else {
        alert('Failed to save contact. Please try again.')
      }
    } catch(error) {
      console.log('Error:', error)
      alert('Could not connect to server. Contact saved locally only.')
      const newContact = {
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim()
      }
      const updatedContacts = [...contacts, newContact]
      setContacts(updatedContacts)
      localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
      setName('')
      setPhone('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-contact-form">
      <input
        type="text"
        placeholder="Contact Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone Number (+91XXXXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addContact()}
      />
      <button
        onClick={() => addContact()}
        disabled={loading}
      >
        {loading ? 'Saving...' : '+ Add Contact'}
      </button>
    </div>
  )
}

export default ContactForm