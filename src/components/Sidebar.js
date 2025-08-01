// src/components/Sidebar.js
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  Visibility,
  Delete,
  Edit,
  Assessment,
  PowerSettingsNew,
  Folder as FolderIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function SidebarLayout({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  selectedPage,
  setSelectedPage,
  kaliteOpen,
  setKaliteOpen,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const menuItems = [
    { label: "Koli İçerik Okutma", key: "okutma", icon: <Visibility /> },
    { label: "Koli İçerik Silme", key: "silme", icon: <Delete /> },
    { label: "Koli İçerik Ekleme", key: "ekleme", icon: <Edit /> },
    { label: "Rapor", key: "rapor", icon: <Assessment /> },
  ];

  return (
    <>
      {/* AppBar üst bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#1c2b36",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Eren Kalite
          </Typography>
          <PowerSettingsNew />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerClose : undefined}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          display: open || isMobile ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1c2b36",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <Divider />

        <List>
          {/* Kalite klasörü başlığı */}
          <ListItemButton onClick={() => setKaliteOpen(!kaliteOpen)}>
            <ListItemIcon sx={{ color: "white" }}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Kalite" sx={{ color: "white" }} />
            {kaliteOpen ? (
              <ExpandLess sx={{ color: "white" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            )}
          </ListItemButton>

          {/* Alt menüler */}
          <Collapse in={kaliteOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuItems.map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={selectedPage === item.key}
                    onClick={() => {
                      setSelectedPage(item.key);
                      if (isMobile) handleDrawerClose(); // mobilde menü tıklanınca drawer kapansın
                    }}
                    sx={{
                      pl: 6,
                      color: "white",
                      "&.Mui-selected": { backgroundColor: "#ffffff22" },
                      "&:hover": { backgroundColor: "#ffffff11" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}
