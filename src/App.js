import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { addBlock, addTerminalState, algorithm, makeGrid } from "./logic";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import GridTable from "./GridTable";
import GridDirectionTable from "./GridDirectionTable";
function App() {
  let defaultgrid = makeGrid(3, 4);
  defaultgrid = addBlock(1, 1, defaultgrid);
  defaultgrid = addTerminalState(0, 3, 1, defaultgrid);
  defaultgrid = addTerminalState(1, 3, -1, defaultgrid);

  const [R, setR] = useState(0);
  const [gamma, setgamma] = useState(0.9);
  const [step, setStep] = useState(1);
  const [grid, setGrid] = useState(defaultgrid);

  return (
    <div className="app">
      <Grid container>
        <Grid item xs={12}>
          <Typography
            component="h1"
            style={{
              padding: "2rem",
              textAlign: "center",
              fontSize: "calc(1.4rem + 12px)",
            }}
          >
            RL Value Iteration
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justify="center"
          direction="row"
        >
          <Grid
            item
            xs={2}
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid item style={{ padding: "4px" }}>
              r ={" "}
            </Grid>
            <Grid item>
              <TextField
                onChange={(e) => {
                  setStep(1);
                  setGrid(defaultgrid);
                  // const x = +e.target.value;
                  // setR(isNaN(x) ? 0 : x);
                  setR(e.target.value);
                }}
                style={{ width: "80px" }}
                variant="outlined"
                margin="dense"
                // type="number"
                value={R}
              />
            </Grid>
          </Grid>

          <Grid
            item
            xs={2}
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid item style={{ padding: "4px" }}>
              &gamma; ={" "}
            </Grid>
            <Grid item>
              <TextField
                onChange={(e) => {
                  setgamma((x) => Math.max(0, Math.min(1, +e.target.value)));
                  setStep(1);
                  setGrid(defaultgrid);
                }}
                style={{ width: "80px" }}
                variant="outlined"
                margin="dense"
                type="number"
                value={gamma}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          // alignItems="center"
          style={{
            minHeight: "55vh",
          }}
        >
          <Grid item xs={12} md={6} sm={6} style={{}}>
            <GridTable justify="flex-end" grid={grid} />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            <GridDirectionTable grid={grid} />
          </Grid>
        </Grid>

        <Grid
          item
          container
          alignItems="center"
          justify="center"
          spacing={2}
          style={{ paddingBottom: "1vw" }}
        >
          <Grid item>
            <TextField
              type="number"
              value={step}
              onChange={(e) => {
                setStep(+e.target.value);
                setGrid(defaultgrid);
              }}
              variant="outlined"
              margin="dense"
              style={{ width: "80px", margin: "auto" }}
            />
          </Grid>
          <Grid item>
            <Button
              style={{ height: "39px" }}
              variant="contained"
              color="primary"
              onClick={(e) => {
                const reward = isNaN(+R) ? 0 : +R;
                if (isNaN(+R)) alert("Reward is not a valid number");

                setGrid(algorithm(defaultgrid, step, reward, gamma));
                setStep((x) => x + 1);
              }}
            >
              step
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
