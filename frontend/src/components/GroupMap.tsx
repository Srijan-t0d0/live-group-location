import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

interface MarkerData {
  id: string;
  position: [number, number];
  timestamp: string;
}

const GroupMap = ({ socket }: Props) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const handleLocationUpdate = (data: any) => {
      const { latitude, longitude, timestamp } = data.location;
      console.log("GroupMap Got Location_update from " + data.name);

      const updatedMarker: MarkerData = {
        id: data.name,
        position: [latitude, longitude],
        timestamp: timestamp,
      };

      setMarkers((prevMarkers) => {
        const filteredMarkers = prevMarkers.filter(
          (marker) => marker.id !== updatedMarker.id
        );
        return [...filteredMarkers, updatedMarker];
      });
    };

    const handleDeleteUser = (name: string) => {
      console.log(`Deleting user: ${name}`);

      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.id !== name)
      );
    };

    socket.on("Location_update", handleLocationUpdate);
    socket.on("delete_user", handleDeleteUser);

    return () => {
      socket.off("Location_update", handleLocationUpdate);
      socket.off("delete_user", handleDeleteUser);
    };
  }, [socket]);

  const formatTimestamp = (timestamp: string): string => {
    const updatedTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = Math.floor(
      (currentTime.getTime() - updatedTime.getTime()) / 60000
    );

    return `${timeDifference} minutes ago`;
  };

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={marker.position}
          radius={10} // Set the radius of the circle marker
          color="blue" // Set the border color of the circle marker
          fillColor="blue" // Set the fill color of the circle marker
          fillOpacity={0.5} // Set the opacity of the circle marker fill
          opacity={0.8} // Set the opacity of the circle marker border
        >
          {/* Popup content for the CircleMarker */}
          <Popup>
            <span style={{ fontSize: "larger", fontWeight: "bold" }}>
              {marker.id}
            </span>
            <br />
            {formatTimestamp(marker.timestamp)}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default GroupMap;
