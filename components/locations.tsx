"use client"

import { MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Locations() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  const locations = [
    {
      id: "catacte",
      name: "Catacte, Bustos, Bulacan",
      type: "PRIMARY",
      description: "Main pick-up location",
      lat: 14.9187,
      lng: 120.9433,
    },
    {
      id: "richwell",
      name: "Plaridel (Richwell)",
      type: "SECONDARY",
      description: "Convenient location",
      lat: 14.9067,
      lng: 120.895,
    },
    {
      id: "baliwag",
      name: "Baliuag",
      type: "SECONDARY",
      description: "Easy access",
      lat: 14.9539,
      lng: 120.9011,
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).L && mapRef.current && !mapInstance.current) {
      const L = (window as any).L

      // Calculate bounds to fit all locations
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]))

      // Create map centered on bounds
      const map = L.map(mapRef.current).fitBounds(bounds, { padding: [50, 50] })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      // Add markers and popups
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          title: location.name,
        }).addTo(map)

        marker.bindPopup(`<strong>${location.name}</strong><br>${location.description}`)
      })

      // Add fullscreen control if available
      if ((L as any).fullScreen) {
        map.addControl(L.fullScreen())
      }

      mapInstance.current = map
      setMapReady(true)
    }
  }, [locations])

  const handleLocationClick = (location: (typeof locations)[0]) => {
    if (mapInstance.current && mapReady) {
      const L = (window as any).L
      mapInstance.current.setView([location.lat, location.lng], 16)

      // Find and open the marker popup
      mapInstance.current.eachLayer((layer: any) => {
        if (layer.getLatLng && layer.getLatLng().lat === location.lat && layer.getLatLng().lng === location.lng) {
          layer.openPopup()
        }
      })
    }
  }

  return (
    <section id="locations" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Available Pick-up Locations
          </h2>
          <p className="text-lg text-muted-foreground">
            Coordinate exact pick-up details via Messenger after order confirmation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {locations.map((location, idx) => (
            <div
              key={idx}
              onClick={() => handleLocationClick(location)}
              data-location={location.id}
              className="location-card p-6 rounded-lg border-2 transition cursor-pointer hover:shadow-lg"
              style={{
                borderColor: location.type === "PRIMARY" ? "var(--accent-peach)" : "var(--accent-sage)",
                backgroundColor:
                  location.type === "PRIMARY"
                    ? "color-mix(in srgb, var(--accent-peach) 10%, transparent)"
                    : "color-mix(in srgb, var(--accent-sage) 10%, transparent)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin
                  className="transition-transform hover:scale-110"
                  style={{ color: location.type === "PRIMARY" ? "var(--accent-peach)" : "var(--accent-sage)" }}
                  size={24}
                />
                <span className="text-xs font-bold uppercase text-accent-sage">{location.type}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{location.name}</h3>
              <p className="text-sm text-muted-foreground">{location.description}</p>
              <p className="text-xs text-muted-foreground mt-3 font-medium">Click to view on map →</p>
            </div>
          ))}
        </div>

        <div
          ref={mapRef}
          id="pickup-map"
          className="rounded-2xl overflow-hidden border border-border shadow-md"
          style={{
            height: "400px",
            backgroundColor: "var(--accent-sage-light)",
          }}
        />
      </div>
    </section>
  )
}
