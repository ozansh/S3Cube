import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const CreateBucket = ({ open, handleClose, fetchBuckets }) => {
  const [provider, setProvider] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [credentials, setCredentials] = useState({});

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
    setCredentials({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const data = {
      provider,
      bucketName,
      credentials,
    };

    // POST request to your API endpoint
    fetch("/buckets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        console.log("Success:", data);
        fetchBuckets();
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          backgroundColor: "white",
          margin: "auto",
          marginTop: "10%",
          borderRadius: 1,
          maxHeight: "80vh",
          overflowY: "auto", // Add Scroll Property
        }}
      >
        <TextField
          fullWidth
          label="Bucket Name"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="provider-label">Provider</InputLabel>
          <Select
            labelId="provider-label"
            value={provider}
            onChange={handleProviderChange}
            label="Provider"
          >
            <MenuItem value="aws">AWS</MenuItem>
            <MenuItem value="azure">Azure</MenuItem>
            <MenuItem value="gcp">GCP</MenuItem>
          </Select>
        </FormControl>

        {provider === "aws" && (
          <>
            <TextField
              fullWidth
              label="AWS Access Key ID"
              name="aws_access_key_id"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="AWS Secret Access Key"
              name="aws_secret_access_key"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="AWS Region"
              name="region"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {provider === "azure" && (
          <>
            <TextField
              fullWidth
              label="Azure Client ID"
              name="azure_client_id"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Azure Client Secret"
              name="azure_client_secret"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Azure Tenant ID"
              name="azure_tenant_id"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Azure Subscription ID"
              name="azure_subscription_id"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Azure Resource Group"
              name="azure_resourceGroup"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Azure Storage Account"
              name="azure_storageAccount"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {provider === "gcp" && (
          <>
            <TextField
              fullWidth
              label="GCP Project"
              name="gcp_project"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="GCP Client Email"
              name="gcp_client_email"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="GCP Private Key"
              name="gcp_private_key"
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Create Bucket
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateBucket;
