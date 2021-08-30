import { useEffect, useState } from "react"

const LocationNotAllowed = () => {
    const [device, setdevice] = useState(null)

    useEffect(() => {
        setdevice(window.navigator.userAgent.split(";")[0].split("(")[1])
    }, [])
console.log(device);
    return (
    <div>
        <h1>Please Enable your location ,because our post are base on your location</h1>
        here's guide to turn it on
        <details>
        <summary>Chorme</summary>
        <p>open settings then allow location</p>
        </details>
        <details>
        <summary>Mozilla</summary>
        <p>open settings then allow location</p>
        </details>
        <details>
        <summary>Chrome(Mobile)</summary>
        <p>open settings then allow location</p>
        </details>
    </div>)
}
 
export default LocationNotAllowed;