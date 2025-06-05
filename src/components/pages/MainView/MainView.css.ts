import { style} from "@vanilla-extract/css";

export const mainView = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
})

// Option Item
export const optionItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1rem",
  borderBottom: "1px solid",
  borderColor: "border",
})
