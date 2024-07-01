import React, { useState, useEffect } from "react";
import {
  Modal,
  Grid,
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
  Typography,
} from "@mui/material";
import { GetDeployments } from "../../utils";
import axios from "axios";
import { GetAllBuckets } from "../../utils/buckets";

export default function CronCreator({ open, handleClose, namespaces }) {
  const [deployments, setDeployments] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    schedule: {
      minute: "*",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    },
    namespaces: [],
    deployments: [],
    bucket: "",
    includeVolumes: false,
  });

  const handleScheduleChange = (field) => (event) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [field]: event.target.value,
      },
    });
  };

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
    const cronSchedule = `${formData.schedule.minute} ${formData.schedule.hour} ${formData.schedule.dayOfMonth} ${formData.schedule.month} ${formData.schedule.dayOfWeek}`;
    const payload = {
      ...formData,
      schedule: cronSchedule,
    };

    try {
      const response = await axios.post("/api/cron-backup", payload);
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getDatas = async () => {
      const deployments = await GetDeployments();
      const buckets = await GetAllBuckets();
      setDeployments(deployments);
      setBuckets(buckets);
    };

    getDatas();
  }, []);

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
          userSelect: "none",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            marginBottom: 2,
          }}
          gutterBottom
        >
          Create Cron Backup
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Minute</InputLabel>
              <Select
                value={formData.schedule.minute}
                onChange={handleScheduleChange("minute")}
              >
                {Array.from(Array(60).keys()).map((i) => (
                  <MenuItem key={i} value={i.toString()}>
                    {i.toString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Hour</InputLabel>
              <Select
                value={formData.schedule.hour}
                onChange={handleScheduleChange("hour")}
              >
                {Array.from(Array(24).keys()).map((i) => (
                  <MenuItem key={i} value={i.toString()}>
                    {i.toString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Day of Month</InputLabel>
              <Select
                value={formData.schedule.dayOfMonth}
                onChange={handleScheduleChange("dayOfMonth")}
              >
                {Array.from(Array(31).keys()).map((i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>
                    {(i + 1).toString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={formData.schedule.month}
                onChange={handleScheduleChange("month")}
              >
                {Array.from(Array(12).keys()).map((i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>
                    {(i + 1).toString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.schedule.dayOfWeek}
                onChange={handleScheduleChange("dayOfWeek")}
              >
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, i) => (
                  <MenuItem key={i} value={i.toString()}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <FormControl fullWidth margin="normal">
          <InputLabel>Namespaces</InputLabel>
          <Select
            multiple
            value={formData.namespaces}
            onChange={handleSelectChange("namespaces")}
            renderValue={(selected) => selected.join(", ")}
          >
            {namespaces?.map((namespace) => (
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
            {deployments?.map((deployment) => (
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
            {buckets?.map((bucket) => (
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
