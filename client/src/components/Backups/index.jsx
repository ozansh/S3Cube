import React, { useState } from "react";
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
import { GetNamespaces, HumanReadableDate } from "../../utils";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import CronCreator from "./CronCreator";
import CreateBackup from "./CreateBackup";

export default function Backups() {
  const [backups, setBackups] = useState([]);
  const [restoreStatus, setRestoreStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [namespaces, setNamespaces] = useState([]);

  React.useEffect(() => {
    const fetchBackups = async () => {
      const ns = await GetNamespaces();
      const response = await axios.get("/backups?bucket=all");
      setBackups(response.data);
      setNamespaces(ns.map((n) => n.name));
    };

    fetchBackups();
  }, []);

  async function handleRestore(backupName) {
    setRestoreStatus("waiting");
    try {
      const response = await axios.post(`/restore`, {
        backupName: backupName,
      });

      if (response.data.error) {
        console.error(response.data.error);
        setRestoreStatus("error");
        return;
      }

      setRestoreStatus("success");
    } catch (error) {
      setRestoreStatus("error");
      console.error(error);
    }
  }

  async function handleDelete(backupName) {
    try {
      const response = await axios.delete(`/backup/${backupName}`);

      if (response.status !== 200) {
        console.error(response.data.error);
        return;
      }

      setBackups(backups.filter((backup) => backup.name !== backupName));
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateOpen = () => setOpenCreate(true);
  const handleCreateClose = () => {
    // Fetch backups again to update the list
    axios
      .get("/backups?bucket=all")
      .then((response) => setBackups(response.data));

    setOpenCreate(false);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateOpen}>
          Create
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Schedule
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <Typography variant="subtitle1">Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Bucket</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Created At</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Persistent Volumes</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Restore</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">Delete</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backups
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="center">{row.bucket}</TableCell>
                  <TableCell align="center">
                    {HumanReadableDate(row.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    {row.hasPersistentVolumes ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={() => handleRestore(row.name)}
                    >
                      <RestoreIcon />
                    </IconButton>
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

      <CronCreator
        open={open}
        handleClose={handleClose}
        namespaces={namespaces}
      />
      <CreateBackup
        open={openCreate}
        handleClose={handleCreateClose}
        namespaces={namespaces}
      />
    </Box>
  );
}
