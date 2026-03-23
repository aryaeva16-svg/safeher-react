import { useState, useEffect } from "react";
function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine)
    useEffect(() => {
        function handleOnline() {
            setIsOffline(false)
        }
        function handleOffline() {
            setIsOffline(true)
        }
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline' , handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if(!isOffline) return null 
    return (
        <div className="offline-banner">
            📡 You are offline- SMS alerts require internet connection.
            <br/>
            GPS location still works ! Call 112 for emergencies.

        </div>
    )
}
export default OfflineBanner