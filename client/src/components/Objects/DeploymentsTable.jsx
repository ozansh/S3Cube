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
  Box,
  Typography,
} from "@mui/material";

const DeploymentsTable = ({ data }) => {
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
            <TableCell sortDirection={orderBy === "replicas" ? order : false}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Replicas
              </Typography>
            </TableCell>
            <TableCell
              sortDirection={orderBy === "availableReplicas" ? order : false}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Available Replicas
              </Typography>
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
                <Typography variant="body2">{row.replicas}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.availableReplicas}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeploymentsTable;
