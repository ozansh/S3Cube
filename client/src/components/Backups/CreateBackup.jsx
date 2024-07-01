import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Button,
} from "@mui/material";
import axios from "axios";
import { GetDeployments } from "../../utils";
import { GetAllBuckets } from "../../utils/buckets";

export default function CreateBackup({ open, handleClose }) {
  const [deployments, setDeployments] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    namespaces: [],
    deployments: [],
    bucket: "",
    includeVolumes: false,
  });

  useEffect(() => {
    // Fetch deployments and buckets data
    const fetchData = async () => {
      try {
        const dep = await GetDeployments();
        const bucs = await GetAllBuckets();

        setDeployments(dep.map((d) => d.name));
        setBuckets(bucs.map((b) => b.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name) => (event) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/backup", formData);
      handleClose();
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Namespaces</InputLabel>
          <Select
            multiple
            value={formData.namespaces}
            onChange={handleSelectChange("namespaces")}
            renderValue={(selected) => selected.join(", ")}
          >
            {["default", "my-namespace", "other-namespace"].map((namespace) => (
              <MenuItem key={namespace} value={namespace}>
                <Checkbox
                  checked={formData.namespaces.indexOf(namespace) > -1}
                />
                <ListItemText primary={namespace} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deployments</InputLabel>
          <Select
            multiple
            value={formData.deployments}
            onChange={handleSelectChange("deployments")}
            renderValue={(selected) => selected.join(", ")}
          >
            {deployments.map((deployment) => (
              <MenuItem key={deployment} value={deployment}>
                <Checkbox
                  checked={formData.deployments.indexOf(deployment) > -1}
                />
                <ListItemText primary={deployment} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Bucket</InputLabel>
          <Select
            value={formData.bucket}
            onChange={handleSelectChange("bucket")}
          >
            {buckets.map((bucket) => (
              <MenuItem key={bucket} value={bucket}>
                {bucket}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.includeVolumes}
              onChange={handleChange}
              name="includeVolumes"
            />
          }
          label="Include Volumes"
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
}
