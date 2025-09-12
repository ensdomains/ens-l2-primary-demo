import { style, globalStyle } from "@vanilla-extract/css"
import { commonVars, modeVars } from "@ensdomains/thorin"

globalStyle(':root', {
  vars: {
    '--profile-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '--profile-shadow-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--profile-dropdown-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '--profile-border-color': '#e8e8e8',
    '--profile-dropdown-bg': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)',
  }
})

globalStyle('html[data-theme="dark"]', {
  vars: {
    '--profile-shadow': '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
    '--profile-shadow-hover': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
    '--profile-dropdown-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    '--profile-border-color': 'rgba(255, 255, 255, 0.2)',
    '--profile-dropdown-bg': 'linear-gradient(180deg, rgba(30, 30, 30, 0.8) 0%, rgba(30, 30, 30, 0.95) 100%)',
  }
})

export const profileButton = style({
  display: "flex",
  alignItems: "center",
  gap: commonVars.space['2'],
  padding: "4px 16px 4px 4px",
  backgroundColor: modeVars.color.background,
  border: "none",
  borderRadius: "35px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 700,
  transition: "all 0.15s ease",
  minHeight: "48px",
  boxShadow: "var(--profile-shadow)",
  ":hover": {
    boxShadow: "var(--profile-shadow-hover)",
  },
  ":focus": {
    outline: "none",
  },
  ":focus-visible": {
    outline: "none",
  },
})

export const profileDropdown = style({
  position: "absolute",
  top: "calc(100% + 12px)",
  right: 0,
  minWidth: "240px",
  backgroundColor: modeVars.color.background,
  border: "none",
  borderRadius: "16px",
  boxShadow: "var(--profile-dropdown-shadow)",
  padding: "8px",
  zIndex: 50,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "16px",
    background: "var(--profile-dropdown-bg)",
    zIndex: -1,
  },
})

export const profileAvatar = style({
  width: "40px",
  height: "40px",
  borderRadius: "9999px",
  overflow: "hidden",
  backgroundColor: modeVars.color.backgroundSecondary,
  flexShrink: 0,
  position: "relative",
  border: "1px solid var(--profile-border-color)",
  selectors: {
    [`${profileButton} &`]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
})

export const profileInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minWidth: 0,
})

export const profileName = style({
  fontSize: "16px",
  fontWeight: 700,
  color: modeVars.color.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "20px",
  fontFamily: "'Satoshi', sans-serif",
  flexGrow: 1,
})

export const profileAddress = style({
  fontSize: "14px",
  color: modeVars.color.textSecondary,
  fontFamily: "monospace",
})

export const dropdownItem = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 500,
  color: modeVars.color.text,
  textAlign: "left",
  transition: "all 0.15s ease",
  ":hover": {
    backgroundColor: modeVars.color.backgroundSecondary,
    transform: "translateX(2px)",
  },
  ":focus": {
    outline: "none",
    backgroundColor: modeVars.color.backgroundSecondary,
  },
  ":active": {
    transform: "scale(0.98)",
  },
})

export const dropdownDivider = style({
  height: "1px",
  backgroundColor: modeVars.color.borderTertiary,
  margin: "6px 8px",
  opacity: 0.5,
})