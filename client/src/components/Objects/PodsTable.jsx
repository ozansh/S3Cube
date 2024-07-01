import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { HumanReadableDate } from "../../utils";

const PodsTable = ({ data }) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = data.sort((a, b) => {
    if (orderBy in a && orderBy in b) {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "name" ? order : false}>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Name
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "namespace" ? order : false}>
              <TableSortLabel
                active={orderBy === "namespace"}
                direction={orderBy === "namespace" ? order : "asc"}
                onClick={() => handleRequestSort("namespace")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Namespace
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "nodeName" ? order : false}>
              <TableSortLabel
                active={orderBy === "nodeName"}
                direction={orderBy === "nodeName" ? order : "asc"}
                onClick={() => handleRequestSort("nodeName")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Node Name
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "status" ? order : false}>
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={() => handleRequestSort("status")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Status
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "startTime" ? order : false}>
              <TableSortLabel
                active={orderBy === "startTime"}
                direction={orderBy === "startTime" ? order : "asc"}
                onClick={() => handleRequestSort("startTime")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Start Time
                </Typography>
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2">{row.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.namespace}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.nodeName}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.status}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {HumanReadableDate(row.startTime)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PodsTable;
