import { useState, useEffect } from 'react'
import SafePlaces from './SafePlaces'
import Toast from './Toast'

function SOSButton() {
  const [sosActive, setSosActive] = useState(false)
  const [buttonText, setButtonText] = useState('SOS')
  const [countdown, setCountdown] = useState(5)
  const [locationText, setLocationText] = useState('📍 Fetching your location...')
  const [mapLink, setMapLink] = useState(null)
  const [coords, setCoords] = useState(null)
  const [sosSent, setSosSent] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'info') {
    setToast({ message, type })
  }

  function hideToast() {
    setToast(null)
  }

  async function getIPLocation() {
    try {
      setLocationText('📍 Fetching approximate location...')
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      const lat = data.latitude
      const lng = data.longitude
      const city = data.city
      const link = `https://www.google.com/maps?q=${lat},${lng}`
      setMapLink(link)
      setCoords({ lat, lng })
      const time = new Date().toLocaleTimeString()
      setLocationText(`📍 Approximate location: ${city} — Last updated: ${time}`)
    } catch(error) {
      setLocationText('❌ Could not fetch location')
    }
  }

  function getLocation() {
    if(navigator.geolocation) {
      setLocationText('📍 Fetching your location...')
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const link = `https://www.google.com/maps?q=${lat},${lng}`
          setMapLink(link)
          setCoords({ lat, lng })
          const time = new Date().toLocaleTimeString()
          setLocationText(`📍 Location found! — Last updated: ${time}`)
        },
        function(error) {
          getIPLocation()
        }
      )
    } else {
      getIPLocation()
    }
  }

  function cancelSOS() {
    clearInterval(window.sosTimer)
    setSosActive(false)
    setButtonText('SOS')
    setCountdown(5)
    showToast('SOS cancelled — You are safe!', 'warning') // ✅ now works!
  }

  function startCountdown() {
    setSosActive(true)
    setButtonText('CANCEL — 5')
    if(!coords) {
      showToast('⚠️ Location not found yet. please wait! z', 'warning')
      return 
    }
    if(!navigator.onLine) {
      showToast('📡 You are offline ! SMS will send when connection returns.', ' warning')  
    }

    let count = 5

    const timer = setInterval(() => {
      count -= 1

      if(count <= 0) {
        clearInterval(timer)
        setButtonText('🚨 SENDING...')
        setSosActive(false)
        setSosSent(true)
        setTimeout(async() => {
          setButtonText('SOS')
          if(!coords) {
            showToast('⚠️ Location not found yet. Please wait!', 'warning')
            return
          }
          try {
            const response = await fetch('http://localhost:5000/send-sos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lat: coords ? coords.lat : null,
                lng: coords ? coords.lng : null,
                userName: 'SafeHer User'
              })
            })
            const data = await response.json()
            console.log('Backend response: ', data)
            if(data.success) {
              setSosSent(true)
              showToast(`✅ SOS sent to ${data.contactsNotified} contacts! Scroll down for safe places ⬇️`, 'success')
            } else {
              showToast(data.message || 'SOS triggered but no contacts found!', 'warning')
            }
          } catch(error) {
            showToast('Could not reach server. Check your connection!', 'error')
          }
        }, 500)
      } else {
        setButtonText(`CANCEL — ${count}`)
      }
    }, 1000)

    window.sosTimer = timer
  }

  function handleSOSClick() {
    if(sosActive) {
      cancelSOS()
    } else {
      startCountdown()
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  return (
    <section id="home" className="home-section">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <h2>Need emergency assistance? </h2>
      <p>Press the SOS button to alert your emergency contacts</p>

      <button
        className={`sos-button ${sosActive ? 'sos-active sos-pulsing' : ''}`}
        onClick={() => handleSOSClick()}
      >
        {buttonText}
      </button>

      <p className="location-text" style={{ fontSize: '1.2rem', textAlign: 'center', padding: '0 1rem', lineHeight: '1.6' }} >
        {locationText}
        {mapLink && (
          <span>
            {' '}
            <br/>
            <a href={mapLink}
              target="_blank"
              className="mapLink"
            >
              View on Google Maps
            </a>
          </span>
        )}
      </p>

      {sosSent && coords && (
        <SafePlaces coords={coords} />
      )}
    </section>
  )
}

export default SOSButton