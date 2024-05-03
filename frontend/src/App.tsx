import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import JoinForm, { JoinFormData } from "./components/JoinForm";
import { Typography } from "@mui/material";
import GroupMap from "./components/GroupMap";
import "./App.css";
import AllowLocation from "./components/AllowLocation";

const currentLocation = window.location;
const SOCKET_SERVER = `https://${currentLocation.hostname}:${currentLocation.port}`;

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [joined, setJoined] = useState(false);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [formData, setFormData] = useState<JoinFormData>({
    name: "",
    room: "",
  });

  // Establish socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle joining a room from local storage
  useEffect(() => {
    const room = localStorage.getItem("room");
    const name = localStorage.getItem("name");

    if (room && name) {
      setFormData({ room, name });
      setJoined(true);

      if (socket) {
        socket.emit("joinRoom", { room, name });
      }
    }
  }, [socket]);

  useEffect(() => {
    if (socket && joined) {
      const handleLocationUpdate = (position: GeolocationPosition) => {
        console.log("watchpositionsuccessful");

        const { latitude, longitude } = position.coords;
        const timestamp = new Date().toISOString();
        const locationData = { latitude, longitude, timestamp };

        socket.emit("UserLocationUpdate", {
          ...formData,
          location: locationData,
        });
      };

      if ("geolocation" in navigator) {
        const options = {
          enableHighAccuracy: true,
        };

        navigator.geolocation.watchPosition(
          (position) => {
            handleLocationUpdate(position);
          },
          (error) => {
            console.error("Error getting location:", error.message);
          },
          options
        );
      } else {
        console.error("Geolocation is not supported by this browser");
      }

      socket.on("joinUpdate", (data) => {
        console.log(data);
      });

      socket.on("Location_update", (data) => {
        console.log(data);
      });
    }
  }, [socket, formData, joined]);

  useEffect(() => {
    const checkLocationPermission = () => {
      if ("geolocation" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              setHasPermission(true);
            } else {
              setHasPermission(false);
            }
          })
          .catch((error) => {
            console.error("Error checking location permission:", error);
            setHasPermission(false);
          });
      } else {
        console.log("Geolocation is not supported");
        setHasPermission(false);
      }
    };

    checkLocationPermission();

    navigator.geolocation.getCurrentPosition((pos) => {
      const { coords } = pos;
      setPosition(coords);
    });
  }, []); // Run only once on initial load, no dependencies

  // Update geolocation when 'joined' state changes
  useEffect(() => {
    if (joined) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { coords } = pos;
        setPosition(coords);
      });
    }
  }, [joined]);

  const joinRoom = (formData: JoinFormData) => {
    if (socket && position) {
      console.log(position);

      const { latitude, longitude } = position;
      const timestamp = new Date().toISOString();
      const locationData = { latitude, longitude, timestamp };

      // Emit the joinRoom event with the user's current position
      socket.emit("joinRoom", { ...formData, location: locationData });

      // Update the states after successfully emitting the event
      setFormData(formData);
      setJoined(true);
    }
  };

  // Leave the room and clear local storage
  const leaveRoom = () => {
    localStorage.removeItem("room");
    localStorage.removeItem("name");
    setJoined(false);
    if (socket) {
      socket.emit("leaveRoom", { ...formData });
    }
  };

  function expandCircle() {
    const circle = document.querySelector(".circle");
    circle?.classList.toggle("expanded");
  }

  if (!hasPermission) {
    return <AllowLocation setHasPermission={setHasPermission} />;
  }

  return (
    <>
      {joined ? (
        <>
          <div className="circle-container">
            <div className="circle">
              <div className="circle-content">
                <Typography>
                  {formData.name + " from room " + formData.room}
                </Typography>
                <button onClick={leaveRoom}>Leave Room</button>
              </div>
              <div
                className="expand-button"
                onClick={() => expandCircle()}
              ></div>
            </div>
          </div>
          {socket && <GroupMap socket={socket} />}
        </>
      ) : (
        <JoinForm
          formData={formData}
          setFormData={setFormData}
          joinRoom={joinRoom}
        />
      )}
    </>
  );
};

export default App;
