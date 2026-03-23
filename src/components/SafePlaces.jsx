import { useState, useEffect } from 'react'

// Priority weights — lower number = higher priority
const CATEGORY_CONFIG = {
  police: {
    emoji: '🚓',
    label: 'Police Station',
    priority: 1,
    alwaysOpen: true,
    color: '#4A90D9'
  },
  hospital: {
    emoji: '🏥',
    label: 'Hospital',
    priority: 2,
    alwaysOpen: true,
    color: '#ff4d6d'
  },
  fire_station: {
    emoji: '🚒',
    label: 'Fire Station',
    priority: 3,
    alwaysOpen: true,
    color: '#ff6b35'
  },
  pharmacy: {
    emoji: '💊',
    label: 'Pharmacy',
    priority: 4,
    alwaysOpen: false,
    color: '#2ecc71'
  },
  convenience: {
    emoji: '🏪',
    label: '24/7 Store',
    priority: 5,
    alwaysOpen: false,
    color: '#f39c12'
  },
  hotel: {
    emoji: '🏨',
    label: 'Hotel',
    priority: 6,
    alwaysOpen: true,
    color: '#9b59b6'
  },
  bank: {
    emoji: '🏦',
    label: 'Bank / ATM',
    priority: 7,
    alwaysOpen: false,
    color: '#1abc9c'
  },
  subway_entrance: {
    emoji: '🚇',
    label: 'Metro Station',
    priority: 8,
    alwaysOpen: false,
    color: '#3498db'
  },
  bus_station: {
    emoji: '🚌',
    label: 'Bus Station',
    priority: 8,
    alwaysOpen: false,
    color: '#3498db'
  },
  university: {
    emoji: '🎓',
    label: 'University / Campus',
    priority: 9,
    alwaysOpen: false,
    color: '#e74c3c'
  },
  community_centre: {
    emoji: '🏛️',
    label: 'Community Centre',
    priority: 9,
    alwaysOpen: false,
    color: '#95a5a6'
  }
}

function SafePlaces({ coords }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isNightTime, setIsNightTime] = useState(false)

  useEffect(() => {
    if (coords) {
      // Check if it's night time (8pm to 6am)
      const hour = new Date().getHours()
      setIsNightTime(hour >= 20 || hour < 6)
      fetchSafePlaces()
    }
  }, [coords])

  async function fetchSafePlaces() {
    try {
      setLoading(true)

      // One big query fetching ALL categories at once
      const query = `
        [out:json][timeout:30];
        (
          node["amenity"="police"](around:3000,${coords.lat},${coords.lng});
          way["amenity"="police"](around:3000,${coords.lat},${coords.lng});
          node["amenity"="hospital"](around:3000,${coords.lat},${coords.lng});
          way["amenity"="hospital"](around:3000,${coords.lat},${coords.lng});
          node["amenity"="fire_station"](around:3000,${coords.lat},${coords.lng});
          node["amenity"="pharmacy"](around:2000,${coords.lat},${coords.lng});
          node["shop"="convenience"](around:1500,${coords.lat},${coords.lng});
          node["amenity"="hotel"](around:2000,${coords.lat},${coords.lng});
          node["tourism"="hotel"](around:2000,${coords.lat},${coords.lng});
          node["amenity"="bank"](around:2000,${coords.lat},${coords.lng});
          node["amenity"="subway_entrance"](around:2000,${coords.lat},${coords.lng});
          node["amenity"="bus_station"](around:2000,${coords.lat},${coords.lng});
          node["amenity"="university"](around:3000,${coords.lat},${coords.lng});
          node["amenity"="community_centre"](around:2000,${coords.lat},${coords.lng});
        );
        out center body;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      })

      const data = await response.json()

      if (data.elements.length === 0) {
        setError('No safe places found nearby. Move to a public area immediately.')
        setLoading(false)
        return
      }

      const currentHour = new Date().getHours()

      const placesWithData = data.elements
        .map((place) => {
          // Some results are 'way' type (buildings) — they have center coords
          const lat = place.lat || place.center?.lat
          const lng = place.lon || place.center?.lon

          if (!lat || !lng) return null

          const amenity =
            place.tags.amenity ||
            place.tags.shop ||
            place.tags.tourism

          const config = CATEGORY_CONFIG[amenity]
          if (!config) return null

          const distance = calculateDistance(
            coords.lat, coords.lng, lat, lng
          )

          // Smart score — combines priority + distance
          // Lower score = show first
          const score = config.priority * 0.4 + parseFloat(distance) * 0.6

          // Night time warning for places that might be closed
          const mightBeClosed =
            !config.alwaysOpen && (currentHour >= 22 || currentHour < 7)

          return {
            id: place.id,
            name: place.tags.name || config.label,
            type: amenity,
            lat,
            lng,
            distance,
            score,
            emoji: config.emoji,
            label: config.label,
            color: config.color,
            alwaysOpen: config.alwaysOpen,
            mightBeClosed,
            address:
              place.tags['addr:street']
                ? `${place.tags['addr:street']}${place.tags['addr:housenumber'] ? ' ' + place.tags['addr:housenumber'] : ''}`
                : 'Address not available',
            phone: place.tags.phone || place.tags['contact:phone'] || null
          }
        })
        .filter(Boolean) // Remove nulls

      placesWithData.sort((a, b) => a.score - b.score)

      const seen = new Set()
      const unique = placesWithData.filter((p) => {
        if (seen.has(p.name)) return false
        seen.add(p.name)
        return true
      })

      setPlaces(unique.slice(0, 10))
      setLoading(false)
    } catch (error) {
      setError('Could not fetch safe places. Check your internet connection.')
      setLoading(false)
    }
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = toRad(lat2-lat1)
    const dLng = toRad(lng2-lng1)
    const a =
       Math.sin(dLat/2)* Math.sin(dLat/2) +
       Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng/ 2) *
          Math.sin(dLng/ 2)
    const c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R*c ).toFixed(1)
  }

  function toRad(value) {
    return value * (Math.PI / 180)
  }

  function openDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/${coords.lat},${coords.lng}/${lat},${lng}`
    window.open(url, '_blank')
  }

  const filterCategories = [
    { key: 'all', label: '🗺️ All' },
    { key: 'emergency', label: '🚨 Emergency' },
    { key: 'medical', label: '🏥 Medical' },
    { key: 'shelter', label: '🏨 Shelter' },
    { key: 'transit', label: '🚇 Transit' }
  ]

  function getFilteredPlaces() {
    if (activeFilter === 'all') return places
    if (activeFilter === 'emergency')
      return places.filter((p) =>
        ['police', 'fire_station'].includes(p.type)
      )
    if (activeFilter === 'medical')
      return places.filter((p) =>
        ['hospital', 'pharmacy'].includes(p.type)
      )
    if (activeFilter === 'shelter')
      return places.filter((p) =>
        ['hotel', 'community_centre', 'convenience'].includes(p.type)
      )
    if (activeFilter === 'transit')
      return places.filter((p) =>
        ['subway_entrance', 'bus_station'].includes(p.type)
      )
    return places
  }

  if (loading) {
    return (
      <div className="safe-places">
        <h3>🔍 Finding nearest safe places...</h3>
        <div className="loading-spinner"></div>
        <p style={{ color: '#aaa', textAlign: 'center', fontSize: '0.85rem' }}>
          Scanning police stations, hospitals, pharmacies and more...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="safe-places">
        <h3>⚠️ {error}</h3>
        <p style={{ color: '#aaa', textAlign: 'center' }}>
          Try calling 112 (Emergency) or 100 (Police)
        </p>
      </div>
    )
  }

  const filteredPlaces = getFilteredPlaces()

  return (
    <div className="safe-places">

      <h3>🛡️ Nearest Safe Places</h3>

      {isNightTime && (
        <div className="night-warning">
          🌙 It's late — places marked ⚠️ may be closed. Prioritize
          hospitals, police stations and hotels.
        </div>
      )}

      {/* Filter buttons */}
      <div className="filter-buttons">
        {filterCategories.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredPlaces.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>
          No places in this category found nearby.
        </p>
      ) : (
        filteredPlaces.map((place) => (
          <div key={place.id} className="safe-place-card">

            <div className="safe-place-left">
              <span className="safe-place-emoji">{place.emoji}</span>
            </div>

            <div className="safe-place-info">
              <span className="safe-place-name">
                {place.name}
                {place.mightBeClosed && (
                  <span className="closed-warning"> ⚠️ May be closed</span>
                )}
                {place.alwaysOpen && (
                  <span className="always-open"> ✅ 24/7</span>
                )}
              </span>
              <span
                className="safe-place-type"
                style={{ color: place.color }}
              >
                {place.label}
              </span>
              <span className="safe-place-distance">
                📍 {place.distance} km away
              </span>
              <span className="safe-place-address">{place.address}</span>
              {place.phone && (
                <a href={`tel:${place.phone}`} className="safe-place-phone">
                  📞 {place.phone}
                </a>
              )}
            </div>

            <button
              className="directions-btn"
              onClick={() => openDirections(place.lat, place.lng)}
            >
              Directions 🗺️
            </button>

          </div>
        ))
      )}

      {/* Emergency numbers at bottom */}
      <div className="emergency-numbers">
        <p>📞 Emergency Helplines</p>
        <div className="helpline-row">
          <a href="tel:112">112 — National Emergency</a>
          <a href="tel:100">100 — Police</a>
          <a href="tel:102">102 — Ambulance</a>
          <a href="tel:1091">1091 — Women Helpline</a>
        </div>
      </div>

    </div>
  )
}

export default SafePlaces