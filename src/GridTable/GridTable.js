import { sizeOfGrid, getCellValue, isValueBlock } from "../logic";
import styles from "./GridTable.module.css";
import { Grid, isWidthDown, Typography, withWidth } from "@material-ui/core";

function GridTable({ grid, justify = "flex-start", width }) {
  console.log(width);
  return (
    <Grid
      container
      item
      alignItems="center"
      justify="center"
      style={{ padding: "2rem" }}
    >
      {grid.map((x) => (
        <Grid
          style={{ width: isWidthDown("xs", width) ? "fit-content" : "none" }}
          key={Math.random()}
          item
          container
          justify={justify}
          direction="row"
        >
          {x.map((y) =>
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
                  {showNumber(y)}
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

function showNumber(x) {
  if (hasTwoZeroDecimals(x)) return x.toExponential(2);
  return parseFloat(x).toFixed(2);
}
function hasTwoZeroDecimals(x) {
  let z = x.toString();
  if (z.indexOf(".") === -1) return false;
  z = z.split(".")[1];
  return z[0] === "0" && z[1] === "0";
}
export default withWidth()(GridTable);
