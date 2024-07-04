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
  Box,
} from "@mui/material";
import { HumanReadableDate } from "../../utils";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { GetBackupsFromSpesificBucekt } from "../../utils/buckets";

export default function BucketBackups() {
  const [backups, setBackups] = useState([]);
  const [restoreStatus, setRestoreStatus] = useState("");

  // FETCH PARAM FROM URL
  const urlParams = new URLSearchParams(window.location.search);
  const bucket = urlParams.get("bucketName");

  React.useEffect(() => {
    const getBackups = async () => {
      const response = await GetBackupsFromSpesificBucekt(bucket);
      setBackups(response);
    };

    getBackups();
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

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      {/* INSERT HERE (ADDITIONAL BUTTONS) */}
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
            {backups?.map((row, index) => (
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
    </Box>
  );
}
