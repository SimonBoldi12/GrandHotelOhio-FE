import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, NavLink } from "react-router-dom";
import { isAuthenticated, isAdmin, isUser, logout,  } from "../../../service/ApiService";
import style from "./Navbar.module.css";
import hotel_svg from "../../../assets/hotel-svg.svg";


function Navbar() {
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const user = isUser();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const navigate = useNavigate();

  function handleLogout() {
    const isLogout = window.confirm("Biztosan ki szeretnél lépni?");
    if (isLogout) {
      logout();
      navigate("/home");
    }
  }

  const navLinks = [
    { to: "/home", label: "Kezdőlap", show: true },
    { to: "/rooms", label: "Szobák", show: true },
    { to: "/find-booking", label: "Foglalásaim", show: authenticated },
    { to: "/admin", label: "Admin", show: !!admin },
    { to: "/login", label: "Bejelentkezés", show: !authenticated },
    { to: "/register", label: "Regisztráció", show: !authenticated },
  ].filter((link) => link.show);

  return (
    <nav>
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO - bal oldalt */}
          <Typography sx={{ minWidth: 100, justifyContent: "center", display: "flex", alignItems: "center"   }}>
            <img src={hotel_svg} alt="Hotel Logo" className={style.logo}/>
            <NavLink to="/home" activeclass="active">
              GRAND HOTEL OHIO
            </NavLink>
          </Typography>

          {/* ASZTALI NÉZET - jobb oldalt */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ minWidth: 100, textAlign: "center" }}>
                <NavLink to="/rooms" activeclass="active">
                  Szobák
                </NavLink>
              </Typography>
              {authenticated && (<Typography sx={{ minWidth: 100 }}>
                <NavLink to="/find-booking" activeclass="active">
                  Foglalásaim
                </NavLink>
              </Typography>)}
              {admin && (
                <Typography sx={{ minWidth: 100, textAlign: "center" }}>
                  <NavLink to="/admin" activeclass="active">
                    Admin
                  </NavLink>
                </Typography>
              )}
              {!authenticated && (
                <Typography sx={{ minWidth: 100 }}>
                  <NavLink to="/login" activeclass="active">
                    Bejelentkezés
                  </NavLink>
                </Typography>
              )}
              {!authenticated && (
                <Typography sx={{ minWidth: 100 }}>
                  <NavLink to="/register" activeclass="active">
                    Regisztráció
                  </NavLink>
                </Typography>
              )}
              <Typography sx={{ minWidth: 100 }}>
                <NavLink to="/home" activeclass="active">
                  Kezdőlap
                </NavLink>
              </Typography>
              {authenticated && (
                <Tooltip title="Fiókom">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* HAMBURGER - mobil */}
          {isMobile && (
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="end"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Desktop account menu */}
        {authenticated && !isMobile && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>
              <Avatar /> Fiókom
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Kilépés
            </MenuItem>
          </Menu>
        )}

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 260 }} role="presentation">
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <List>
              {navLinks.map((link) => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={link.to}
                    onClick={toggleDrawer(false)}
                  >
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))}

              {authenticated && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <NavLink to="/profile" style={{ textDecoration: "none", color: "inherit" }} onClick={toggleDrawer(false)}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={toggleDrawer(false)}>
                        <Avatar sx={{ width: 28, height: 28, mr: 1 }}></Avatar>
                        <ListItemText primary="Fiókom" />
                      </ListItemButton>
                    </ListItem>
                  </NavLink>
                  <ListItem disablePadding >
                    <ListItemButton onClick={toggleDrawer(false)}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Kilépés" onClick={() => { handleClose(); handleLogout(); }}/>
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </nav>
  );
}

export default Navbar;