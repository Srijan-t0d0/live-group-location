import { ChangeEvent, FormEvent } from "react";
import {
  Button,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Grid,
} from "@mui/material";

export interface JoinFormData {
  name: string;
  room: string;
}

interface JoinFormProps {
  formData: JoinFormData;
  setFormData: (formData: JoinFormData) => void;
  joinRoom: (formData: JoinFormData) => void;
}

const JoinForm = ({ joinRoom, setFormData, formData }: JoinFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("room", formData.room);
    localStorage.setItem("name", formData.name);
    joinRoom(formData);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    // Update the form data by providing a complete JoinFormData object
    setFormData(updatedFormData);
  };
  return (
    <Container component={"main"} maxWidth="xs">
      <CssBaseline />

      <Box marginTop={"35vh"}>
        <Typography component="h1" variant="h5">
          Join Room
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="room"
            label="Room"
            type="room"
            id="room"
            value={formData.room}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Join
          </Button>
          <Grid container>
            <Grid marginInline={"auto"} item></Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default JoinForm;
