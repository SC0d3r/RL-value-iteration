import {
  isValueBlock,
  getDirection,
  DIRECTIONS,
  isTerminalState,
} from "../logic";
import styles from "./GridDirectionTable.module.css";
import { Grid, isWidthDown, Typography, withWidth } from "@material-ui/core";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckIcon from "@material-ui/icons/Check";

function GridDirectionTable({ grid, justify = "flex-start", width }) {
  return (
    <Grid
      container
      item
      // alignItems="center"
      justify="center"
      style={{
        padding: "2rem",
      }}
    >
      {grid.map((x, i) => (
        <Grid
          style={{ width: isWidthDown("xs", width) ? "fit-content" : "none" }}
          key={Math.random()}
          item
          container
          justify={justify}
          direction="row"
        >
          {x.map((y, j) =>
            !isValueBlock(y) ? (
              <Grid
                alignItems="center"
                justify="center"
                key={Math.random()}
                item
                className={styles.cell}
              >
                <Typography
                  component="body"
                  style={{
                    fontSize: "calc(0.5rem + 5px)",
                  }}
                >
                  {isTerminalState(i, j, grid) ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : DIRECTIONS.LEFT === getDirection(i, j, grid) ? (
                    <ArrowBackIcon style={{ color: "rgba(3,2,255,0.9)" }} />
                  ) : DIRECTIONS.RIGHT === getDirection(i, j, grid) ? (
                    <ArrowBackIcon
                      style={{
                        transform: "scaleX(-1)",
                        color: "rgba(3,2,255,0.9)",
                      }}
                    />
                  ) : DIRECTIONS.UP === getDirection(i, j, grid) ? (
                    <ArrowBackIcon
                      style={{
                        transform: "rotate(90deg)",
                        color: "rgba(3,2,255,0.9)",
                      }}
                    />
                  ) : (
                    <ArrowBackIcon
                      style={{
                        transform: "rotate(-90deg)",
                        color: "rgba(3,2,255,0.9)",
                      }}
                    />
                  )}
                </Typography>
              </Grid>
            ) : (
              <Grid
                item
                className={styles.cell}
                style={{ background: "rgba(0,0,0,0.7)" }}
              ></Grid>
            )
          )}
        </Grid>
      ))}
    </Grid>
  );
}

export default withWidth()(GridDirectionTable);
