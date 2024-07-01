import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BackupIcon from "@mui/icons-material/Backup";
import { ReactComponent as ClusterIcon } from "../../assets/img/cluster-icon.svg";
import { ReactComponent as BucketIcon } from "../../assets/img/s3bucket.svg";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton onClick={() => (window.location.href = "/")}>
      <ListItemIcon>
        <ClusterIcon />
      </ListItemIcon>
      <ListItemText primary="States" />
    </ListItemButton>
    <ListItemButton onClick={() => (window.location.href = "/backups")}>
      <ListItemIcon>
        <BackupIcon />
      </ListItemIcon>
      <ListItemText primary="Backups" />
    </ListItemButton>
    <ListItemButton onClick={() => (window.location.href = "/buckets")}>
      <ListItemIcon>
        <BucketIcon
          style={{
            width: "24px",
            height: "24px",
            fill: "currentColor",
          }}
        />
      </ListItemIcon>
      <ListItemText primary="Buckets" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = <React.Fragment></React.Fragment>;
