import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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
import {
  isAuthenticated,
  isAdmin,
  logout,
  getLoggedInUserName,
  getLoggedInUserEmail,
  isStaff,
} from "../../../service/ApiService";
import style from "./Navbar.module.css";
import hotel_svg from "../../../assets/hotel-svg.svg";
import logo from "../../../assets/images/GrandHotelOhio_logo.png";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../confirm-dialog/ConfirmDialog";

function getMonogramColors() {
  try {
    const email = getLoggedInUserEmail();
    if (!email) return { bg: "#6b7280", text: "#ffffff" };
    const saved = localStorage.getItem(`monogramColors_${email}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { bg: "#6b7280", text: "#ffffff" };
}

function Monogram({ size = 32 }) {
  const name = getLoggedInUserName();
  const letter = name?.charAt(0)?.toUpperCase() || "?";
  const { bg, text } = getMonogramColors();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: text,
        fontWeight: 700,
        fontSize: size * 0.4,
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

function Navbar() {
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const staff = isStaff();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const navigate = useNavigate();

  const { confirm, config } = useConfirm();

  async function handleLogout() {
        const ok = await confirm({
            title: "Kijelentkezés",
            message: "Biztosan ki szeretnél lépni a fiókodból?",
            confirmText: "Kilépés",
            cancelText: "Mégse",
            confirmVariant: "warning",
        });
        if (ok) {
            logout();
            navigate("/home");
        }
    }

  const navLinks = [
    { to: "/home", label: "Kezdőlap", show: true },
    { to: "/rooms", label: "Szobák", show: true },
    { to: "/services", label: "Szolgáltatások", show: true },
    { to: "/gallery", label: "Galéria", show: true },
    { to: "/find-booking", label: "Foglalásaim", show: authenticated },
    { to: "/admin", label: "Admin", show: !!admin || !!staff },
    { to: "/login", label: "Bejelentkezés", show: !authenticated },
    { to: "/register", label: "Regisztráció", show: !authenticated },
  ].filter((link) => link.show);

  return (
    <nav>
      <div className={style.navInner}>
        <React.Fragment>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <NavLink to="/home" className={style.brand}>
              <img src={logo} alt="Hotel Logo" className={style.logo} />
            </NavLink>

            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <NavLink to="/home">Kezdőlap</NavLink>
                <NavLink to="/rooms">Szobák</NavLink>
                <NavLink to="/services">Szolgáltatások</NavLink>
                <NavLink to="/gallery">Galéria</NavLink>
                {authenticated && (
                  <NavLink to="/find-booking">Foglalásaim</NavLink>
                )}
                {admin || staff ? <NavLink to="/admin">Admin</NavLink> : null}
                {!authenticated && <NavLink to="/login">Bejelentkezés</NavLink>}
                {!authenticated && (
                  <NavLink
                    to="/register"
                    style={{
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      marginLeft: "8px",
                      fontWeight: 600,
                    }}
                  >
                    Regisztráció
                  </NavLink>
                )}
                {authenticated && (
                  <Tooltip title="Fiókom">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <Monogram size={34} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}

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
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: "12px",
                    border: "1px solid #e0e7ff",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
                    "& .MuiDivider-root": {
                      margin: "4px 0",
                      borderColor: "#e0e7ff",
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
                      border: "1px solid #e0e7ff",
                      borderRight: "none",
                      borderBottom: "none",
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#374151",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  "&:hover": { backgroundColor: "#eff6ff", color: "#2563eb" },
                }}
              >
                <Monogram size={28} /> Fiókom
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLogout();
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#dc2626",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "4px 8px",
                  "&:hover": { backgroundColor: "#fef2f2", color: "#b91c1c" },
                }}
              >
                <ListItemIcon sx={{ color: "#dc2626" }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Kilépés
              </MenuItem>
            </Menu>
          )}

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
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
                    <NavLink
                      to="/profile"
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItem disablePadding>
                        <ListItemButton sx={{ gap: 1 }}>
                          <Monogram size={28} />
                          <ListItemText primary="Fiókom" />
                        </ListItemButton>
                      </ListItem>
                    </NavLink>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          toggleDrawer(false)();
                          handleLogout();
                        }}
                      >
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Kilépés" />
                      </ListItemButton>
                    </ListItem>
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
      {config && <ConfirmDialog {...config} />}
    </nav>
    
  );
}

export default Navbar;
