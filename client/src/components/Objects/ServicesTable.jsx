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

const ServicesTable = ({ data }) => {
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
            <TableCell sortDirection={orderBy === "type" ? order : false}>
              <TableSortLabel
                active={orderBy === "type"}
                direction={orderBy === "type" ? order : "asc"}
                onClick={() => handleRequestSort("type")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Type
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "clusterIP" ? order : false}>
              <TableSortLabel
                active={orderBy === "clusterIP"}
                direction={orderBy === "clusterIP" ? order : "asc"}
                onClick={() => handleRequestSort("clusterIP")}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Cluster IP
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
                <Typography variant="body2">{row.type}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.clusterIP}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServicesTable;
