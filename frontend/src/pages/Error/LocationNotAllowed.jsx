import { useEffect, useState } from "react"

const LocationNotAllowed = () => {
    const [device, setdevice] = useState(null)

    useEffect(() => {
        setdevice(window.navigator.userAgent.split(";")[0].split("(")[1])
    }, [])
    return (
    <div style={{textAlign: 'center'}}>
        {device === 'iPhone' || device === 'iPad' || device === "Linux" ? (
            
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="locationerror_mobile" style={{width: 200}} />
            </div>
        ) : (
            <div className="locationerror" />
        )}
        
        
        <h1>We need your permission to enable your location</h1>
        <p>{"To enable your location please go to: 🔒 in your browser > Location > Allow"}
        </p>
        <button onClick={() => window.location.reload()} style={{width: 200, backgroundColor: "var(--primary-color)", padding: 10, borderRadius: 15, color: 'white'}}>Reload</button>
            
    </div>)
}
 
export default LocationNotAllowed;