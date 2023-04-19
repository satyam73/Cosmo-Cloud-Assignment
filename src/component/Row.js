import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import { DATA_TYPES } from "../constant";
import { TextField } from "@mui/material";

function Row({
  id,
  field_name,
  field_type,
  isRequired,
  allRowInfo,
  setAllRowInfo,
  child,
  style,
}) {
  const [isFieldInputVisible, setIsFieldInputVisible] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);
  const [showActions, setShowActions] = useState(false);

  function changeRequired(e) {
    let value;
    if (isRequired) {
      value = false;
    } else {
      value = true;
    }
    const id = e.target.name;

    function updateVal(obj, id, newVal) {
      if (obj.id.toString() === id) {
        obj.isRequired = newVal;
        return;
      }

      if (obj.child.length > 0) {
        obj.child.forEach((child) => {
          updateVal(child, id, newVal);
        });
      }
    }
    const updatedState = [...allRowInfo];

    updatedState.forEach((val) => {
      updateVal(val, id, value);
    });
    setAllRowInfo([...updatedState]);
  }

  const handleChange = (e) => {
    const id = e.target.name;
    const value = e.target.value;
    const updatedState = [...allRowInfo];

    if (e.target.value !== "Object") {
      setShowAddIcon(false);
    } else {
      setShowAddIcon(true);
    }

    function updateVal(obj, id, newType) {
      if (obj.id.toString() === id) {
        obj.field_type = newType;
        return;
      }

      if (obj.child.length > 0) {
        obj.child.forEach((child) => {
          updateVal(child, id, newType);
        });
      }
    }

    updatedState.forEach((val) => {
      updateVal(val, id, value);
    });

    setAllRowInfo([...updatedState]);
  };

  const fieldClickHandler = (e) => {
    setIsFieldInputVisible(true);
  };

  const inputHandler = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    const updatedState = [...allRowInfo];

    function updateVal(obj, id, newName) {
      if (obj.id.toString() === id) {
        obj.field_name = newName;
        return;
      }
      if (obj.child.length > 0) {
        obj.child.forEach((child) => {
          updateVal(child, id, newName);
        });
      }
    }

    updatedState.forEach((val) => {
      updateVal(val, id, value);
    });
    setAllRowInfo([...updatedState]);
  };

  const blurHandler = (e) => {
    setIsFieldInputVisible(false);
  };

  const addHandler = (e, id) => {
    const row = {
      id: uuidv4().toString(),
      field_name: `field`,
      field_type: "Object",
      isRequired: false,
      child: [],
    };
    const updatedState = [...allRowInfo];

    updatedState.forEach((data) => {
      addVal(data, id, row);
    });

    function addVal(obj, id, newRow) {
      if (obj.id.toString() === id) {
        let tempArr = [...obj.child, { ...newRow }];
        obj.child = tempArr;
        return;
      }
      if (obj.child.length > 0) {
        obj.child.forEach((child) => {
          addVal(child, id, newRow);
        });
      }
    }
    setAllRowInfo([...updatedState]);
  };

  const hoverHandler = (e) => {
    setShowActions(true);
    if (field_type === "Object") {
      setShowAddIcon(true);
    } else {
      setShowAddIcon(false);
    }
  };

  const deleteHandler = (e, id, type) => {
    let updatedState = [...allRowInfo];

    function deleteObj(obj, id) {
      for (let prop in obj) {
        if (obj[prop] !== null && typeof obj[prop] === "object") {
          if (obj[prop].id === id) {
            delete obj[prop];
            return;
          } else {
            deleteObj(obj[prop], id);
          }
        } else if (Array.isArray(obj[prop])) {
          obj[prop].forEach((item) => {
            if (item.id === id) {
              const index = obj[prop].indexOf(item);
              obj[prop].splice(index, 1);
              return;
            } else {
              deleteObj(item, id);
            }
          });
        }
      }
    }

    updatedState.forEach((data) => {
      if (data.id === id) {
        updatedState = updatedState.filter((obj) => {
          return obj != data;
        });
      }
      deleteObj(data, id);
    });

    setAllRowInfo([...updatedState]);
  };
  return (
    <>
      <div
        style={style}
        className="Row"
        data-id={id}
        onMouseEnter={hoverHandler}
      >
        <div className="Row__info">
          <div
            className="Row__field_name"
            data-field={field_name}
            style={{ display: isFieldInputVisible ? "none" : "block" }}
            onDoubleClick={(e) => {
              fieldClickHandler(e);
            }}
          >
            {field_name}
          </div>
          <TextField
            id={id}
            value={field_name}
            variant="outlined"
            sx={{
              display: isFieldInputVisible ? "block" : "none",
              "& .MuiInputBase-input": {
                p: 0,
                height: "2.4rem",
                width: "8rem",
              },
            }}
            onInput={inputHandler}
            onBlur={blurHandler}
          />
          <div className="Row__field_type">
            <FormControl
              className="Row__form-control"
              variant="filled"
              sx={{ minWidth: 130 }}
              size="small"
            >
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={field_type}
                label="Data type"
                onChange={handleChange}
                name={id}
                className="Row__select"
              >
                {DATA_TYPES.map((type, index) => (
                  <MenuItem className="Row__menu-item" key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {showActions && (
          <div className="Row__actions">
            <FormControlLabel
              label="Required"
              labelPlacement="start"
              control={
                <Switch
                  checked={isRequired}
                  name={id}
                  onChange={changeRequired}
                  color="primary"
                />
              }
            />
            {showAddIcon && (
              <IconButton aria-label="add" onClick={(e) => addHandler(e, id)}>
                <AddIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="delete"
              onClick={(e) => deleteHandler(e, id, field_type)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </div>
      {child?.length > 0 &&
        child.map((child) => (
          <div
            style={{ marginLeft: "20px", borderLeft: "2px solid grey" }}
            key={child.id}
          >
            <Row
              // key={child.id}
              id={child.id}
              field_name={child.field_name}
              field_type={child.field_type}
              isRequired={child.isRequired}
              allRowInfo={allRowInfo}
              setAllRowInfo={setAllRowInfo}
              child={child.child}
            />
          </div>
        ))}
    </>
  );
}

export default Row;
