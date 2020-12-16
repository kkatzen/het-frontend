import React from "react";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Fips } from "../../utils/madlib/Fips";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import styles from "./FipsSelector.module.scss";

function FipsSelector(props: {
  value: string;
  options: Fips[];
  onGeoUpdate: (fipsCode: string) => void;
}) {
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
        {new Fips(props.value).getFullDisplayName()}
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
        <div className={styles.FipsSelectorPopover}>
          <span className={styles.SearchForText}>Search for location</span>
          <Autocomplete
            disableClearable={true}
            options={props.options}
            clearOnEscape={true}
            getOptionLabel={(fips) => fips.getFullDisplayName()}
            getOptionSelected={(fips) => fips.code === props.value}
            renderOption={(fips) => <>{fips.getFullDisplayName()}</>}
            renderInput={(params) => (
              <TextField
                placeholder="County, State, Territory, or United States" // TODO- update depending on what options are
                margin="dense"
                variant="outlined"
                {...params}
              />
            )}
            onChange={(e, fips) => {
              props.onGeoUpdate(fips.code);
              handleClose();
            }}
          />
          <span className={styles.NoteText}>
            Note: City and census tract location is currently unavailable
          </span>
        </div>
      </Popover>
    </>
  );
}

export default FipsSelector;
