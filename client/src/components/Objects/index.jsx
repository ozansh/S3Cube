import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  GetDeployments,
  GetServices,
  GetPods,
  GetNamespaces,
} from "../../utils/index";
import DeploymentsTable from "./DeploymentsTable";
import NamespacesTable from "./NamespacesTable";
import ServicesTable from "./ServicesTable";
import PodsTable from "./PodsTable";

const Dashboard = () => {
  const [data, setData] = useState({
    deployments: [],
    namespaces: [],
    services: [],
    pods: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("deployments");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deployments, namespaces, services, pods] = await Promise.all([
          GetDeployments(),
          GetNamespaces(),
          GetServices(),
          GetPods(),
        ]);

        setData({
          deployments: deployments,
          namespaces: namespaces,
          services: services,
          pods: pods,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const renderTable = () => {
    if (loading) return <CircularProgress />;

    switch (selectedCategory) {
      case "deployments":
        return <DeploymentsTable data={data.deployments} />;
      case "namespaces":
        return <NamespacesTable data={data.namespaces} />;
      case "services":
        return <ServicesTable data={data.services} />;
      case "pods":
        return <PodsTable data={data.pods} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, height: "100%", width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Stats
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Deployments</Typography>
            <Typography variant="h4">{data.deployments.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Namespaces</Typography>
            <Typography variant="h4">{data.namespaces.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Services</Typography>
            <Typography variant="h4">{data.services.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Pods</Typography>
            <Typography variant="h4">{data.pods.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => handleCategoryChange("deployments")}
            sx={{
              backgroundColor:
                selectedCategory === "deployments" ? "green" : "",
            }}
          >
            Deployments
          </Button>
          <Button
            onClick={() => handleCategoryChange("namespaces")}
            sx={{
              backgroundColor: selectedCategory === "namespaces" ? "green" : "",
            }}
          >
            Namespaces
          </Button>
          <Button
            onClick={() => handleCategoryChange("services")}
            sx={{
              backgroundColor: selectedCategory === "services" ? "green" : "",
            }}
          >
            Services
          </Button>
          <Button
            onClick={() => handleCategoryChange("pods")}
            sx={{
              backgroundColor: selectedCategory === "pods" ? "green" : "",
            }}
          >
            Pods
          </Button>
        </ButtonGroup>
      </Box>

      {renderTable()}
    </Box>
  );
};

export default Dashboard;
