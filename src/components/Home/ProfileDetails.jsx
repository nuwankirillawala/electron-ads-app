import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileDetails = ({ user }) => {
  return (
    <Grid item xs={5}>
      <Paper
        elevation={3}
        sx={{ padding: 3, textAlign: "center", height: "100%" }}
      >
        <PersonIcon fontSize="large" color="primary" />
        <Typography variant="h6">
          {user ? user.profile.firstName + " " + user.profile.lastName : "User"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user ? user.email : "user@example.com"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Employee No: {user.profile.employeeNo || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Department: {user.profile.department?.departmentName || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          User Role: {user.profile.employeeRole?.role || "N/A"}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default ProfileDetails;
