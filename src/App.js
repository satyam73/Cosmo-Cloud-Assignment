import React, { useState } from "react";
import "./App.css";
import Row from "./component/Row";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { v4 as uuidv4 } from "uuid";

function App() {
  const [allRowInfo, setAllRowInfo] = useState([
    {
      id: uuidv4(),
      field_name: "Person",
      field_type: "Object",
      isRequired: false,
      child: [],
    },
  ]);

  const addNewObj = (e) => {
    setAllRowInfo([
      ...allRowInfo,
      {
        id: uuidv4(),
        field_name: "field",
        field_type: "Object",
        isRequired: false,
        child: [],
      },
    ]);
  };
  return (
    <div className="App" data-testid="App">
      {/* <h1>Hello</h1> */}
      <span className="addNewObjBtn">
        <IconButton aria-label="delete" onClick={(e) => addNewObj(e)}>
          <AddIcon />
        </IconButton>
      </span>
      {allRowInfo.length > 0 &&
        allRowInfo.map((rowInfo) => {
          return (
            <Row
              key={rowInfo.id}
              id={rowInfo.id}
              field_name={rowInfo.field_name}
              field_type={rowInfo.field_type}
              isRequired={rowInfo.isRequired}
              allRowInfo={allRowInfo}
              setAllRowInfo={setAllRowInfo}
              child={rowInfo.child}
              style={{ marginLeft: "10px" }}
            />
          );
        })}
      <Button
        sx={{ width: "fit-content" }}
        className="saveBtn"
        variant="contained"
        onClick={(e) => {
          console.log("Here's your schema you've created 🙂\n", allRowInfo);
        }}
      >
        Save
      </Button>
    </div>
  );
}

export default App;
