/**
 * @file ProfileDetails.jsx
 * @description A component to display user profile details such as name, email, employee number, department, and role.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // Usage in another component
 * <ProfileDetails user={user} />
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.user - The user object containing profile details.
 *
 * @returns {JSX.Element} A component that renders user profile information.
 */

import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileDetails = ({ user }) => {
  return (
    <Grid item xs={5}>
      {/* Main container for profile details */}
      <Paper
        elevation={3}
        sx={{ padding: 3, textAlign: "center", height: "100%" }}
      >
        {/* Icon representing the user */}
        <PersonIcon fontSize="large" color="primary" />

        {/* User's full name */}
        <Typography variant="h6">
          {user ? user.profile.firstName + " " + user.profile.lastName : "User"}
        </Typography>

        {/* User's email */}
        <Typography variant="body2" color="textSecondary">
          {user ? user.email : "user@example.com"}
        </Typography>

        {/* User's employee number */}
        <Typography variant="body2" color="textSecondary">
          Employee No: {user.profile.employeeNo || "N/A"}
        </Typography>

        {/* User's department */}
        <Typography variant="body2" color="textSecondary">
          Department: {user.profile.department?.departmentName || "N/A"}
        </Typography>

        {/* User's role */}
        <Typography variant="body2" color="textSecondary">
          User Role: {user.profile.employeeRole?.role || "N/A"}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default ProfileDetails;
