// src/App.js
import React, { useState } from "react";
import { Box, Snackbar, Toolbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

import SidebarLayout from "./components/Sidebar";
import KoliIcerikOkutma from "./pages/KoliIcerikOkutma";
import KoliIcerikSilme from "./pages/KoliIcerikSilme";
import KoliIcerikEkleme from "./pages/KoliIcerikEkleme";
import Rapor from "./pages/Rapor";

const drawerWidth = 20;

export default function App() {
  const [open, setOpen] = useState(false);
  const [kaliteOpen, setKaliteOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("okutma");
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    sev: "info",
  });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const showSnackbar = (msg, sev = "info") =>
    setSnackbar({ open: true, msg, sev });
  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarLayout
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        kaliteOpen={kaliteOpen}
        setKaliteOpen={setKaliteOpen}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: !isMobile && open ? `${drawerWidth}px` : 0,
          maxWidth: `calc(100% - ${!isMobile && open ? drawerWidth : 0}px)`,
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Toolbar /> {/* AppBar yüksekliği kadar boşluk bırak */}
        {selectedPage === "okutma" && (
          <KoliIcerikOkutma showSnackbar={showSnackbar} />
        )}
        {selectedPage === "silme" && (
          <KoliIcerikSilme showSnackbar={showSnackbar} />
        )}
        {selectedPage === "ekleme" && (
          <KoliIcerikEkleme showSnackbar={showSnackbar} />
        )}
        {selectedPage === "rapor" && <Rapor showSnackbar={showSnackbar} />}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.sev}
          variant="filled"
        >
          {snackbar.msg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
