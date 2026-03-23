import { useEffect } from 'react'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  function getBackground() {
    if(type === 'success') return 'linear-gradient(135deg, #2ecc71, #27ae60)'
    if(type === 'error') return 'linear-gradient(135deg, #ff4d6d, #cc0033)'
    if(type === 'warning') return 'linear-gradient(135deg, #ffc107, #e67e22)'
    return 'linear-gradient(135deg, #4A90D9, #357abd)'
  }

  function getEmoji() {
    if(type === 'success') return '✅'
    if(type === 'error') return '❌'
    if(type === 'warning') return '⚠️'
    return 'ℹ️'
  }

  return (
    <div className="toast" style={{ background: getBackground() }}>
      <span className="toast-emoji">{getEmoji()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}

export default Toast