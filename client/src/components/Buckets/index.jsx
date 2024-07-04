import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { GetNamespaces } from "../../utils";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateBucketComponent from "./CreateBucket";

export default function Buckets() {
  const [buckets, setBuckets] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [namespaces, setNamespaces] = useState([]);

  const fetchBuckets = async () => {
    const ns = await GetNamespaces();
    const response = await axios.get("/buckets?bucket=all");
    setBuckets(response.data);
    setNamespaces(ns);
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  async function handleDelete(bucketName) {
    try {
      const response = await axios.delete(`/buckets/${bucketName}`);

      if (response.status !== 200) {
        console.error(response.data.error);
        return;
      }

      setBuckets(buckets.filter((bucket) => bucket.name !== bucketName));
    } catch (error) {
      console.error(error);
    }
  }

  const handleCreateOpen = () => setOpenCreate(true);
  const handleCreateClose = () => setOpenCreate(false);

  return (
    <Box sx={{ p: 3, height: "100%", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateOpen}>
          Create
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          ml: 3,
          height: "100%",
          width: "100%",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <Typography variant="subtitle1">Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Delete</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buckets?.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      (window.location.href = `/backups/buckets/${row.name}`)
                    }
                    sx={{ textTransform: "none", color: "black" }}
                  >
                    {row.name}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(row.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateBucketComponent
        open={openCreate}
        fetchBuckets={fetchBuckets}
        handleClose={handleCreateClose}
        namespaces={namespaces}
      />
    </Box>
  );
}
