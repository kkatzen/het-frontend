import React from "react";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import styles from "./FipsSelector.module.scss";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function VarSelector(props: {
  value: string;
  options: string[][];
  onVarUpdate: (option: string) => void;
}) {
  console.log("kkz", props.options);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="text"
        className={styles.MadLibButton}
        onClick={handleClick}
      >
        {props.value /* should be display name*/}
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {props.options.map((item: string[]) => (
            <ListItem
              button
              selected={item[0] === props.value}
              onClick={() => {
                handleClose();
                props.onVarUpdate(item[0]);
              }}
            >
              <ListItemText primary={item[1]} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}

export default VarSelector;
