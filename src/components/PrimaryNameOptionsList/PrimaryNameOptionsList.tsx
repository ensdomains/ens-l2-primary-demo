import { Typography } from "@ensdomains/thorin";
import { container, header, content, listHeader, listItem } from "./PrimaryNameOptionsList.css";

export const PrimaryNameOptionsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={container}>
      <div className={header}>
        <Typography fontVariant="headingOne">
          L2 Primary Name
        </Typography>
      </div>
      <div className={content}>
        {children}
      </div>
    </div>
  );
};

const Header = ({ label, title }: { label: string, title: string }) => {
  return <div className={listHeader}>
    <Typography fontVariant="body">{label}</Typography>
    <Typography fontVariant="headingTwo">{title}</Typography>
  </div>
}

const Item = ({ children }: { children: React.ReactNode }) => {
  return <div className={listItem}>{children}</div>
}

PrimaryNameOptionsList.displayName = "PrimaryNameOptionsList";
PrimaryNameOptionsList.Header = Header;
PrimaryNameOptionsList.Item = Item;