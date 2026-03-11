"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "../lib/supabase";

export default function Map() {

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const friends = ["Adam", "Ola", "Marek"];

  useEffect(() => {

    if (mapRef.current) return;

    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [10, 50],
      zoom: 2
    });

    mapRef.current = map;

  }, []);

  async function searchCity() {

    if (!search) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=1`
    );

    const data = await res.json();

    if (!data.length) return;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 10
    });

    setSearch("");
  }

  async function loadFriendPlaces(friend: string) {

    const map = mapRef.current;
    if (!map) return;

    const { data } = await supabase
      .from("places")
      .select("*")
      .eq("user_id", friend);

    data?.forEach((place) => {

      new maplibregl.Marker({ color: "blue" })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

    });

  }

  function selectFriend(friend: string) {

    setSelectedFriend(friend);
    loadFriendPlaces(friend);

  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* PANEL ZNAJOMYCH */}
      <div
        style={{
          width: "20%",
          background: "#111",
          color: "white",
          padding: "20px"
        }}
      >

        <h3>Znajomi</h3>

        {friends.map((f) => (
          <div
            key={f}
            style={{
              padding: "8px",
              cursor: "pointer",
              background: selectedFriend === f ? "#333" : "transparent"
            }}
            onClick={() => selectFriend(f)}
          >
            {f}
          </div>
        ))}

      </div>

      {/* MAPA */}
      <div
        ref={mapContainer}
        style={{ width: "60%", height: "100%" }}
      />

      {/* PANEL WYSZUKIWANIA */}
      <div
        style={{
          width: "20%",
          background: "#111",
          color: "white",
          padding: "20px"
        }}
      >

        <h3>Wyszukaj miasto</h3>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchCity();
            }
          }}
          placeholder="Wpisz miasto..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button
          onClick={searchCity}
          style={{
            width: "100%",
            padding: "10px"
          }}
        >
          Szukaj
        </button>

      </div>

    </div>
  );
}