import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

interface AllowLocationProps {
  setHasPermission: (value: boolean) => void;
}

const AllowLocation: React.FC<AllowLocationProps> = ({ setHasPermission }) => {
  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      setHasPermission(true);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card>
        <CardContent>
          <h2>Please allow location access</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAllowLocation}
          >
            Allow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllowLocation;
