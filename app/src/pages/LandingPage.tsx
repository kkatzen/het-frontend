import React from "react";
import styles from "./LandingPage.module.scss";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { LinkWithStickyParams } from "../utils/urlutils";
import { linkToMadLib } from "../utils/urlutils";

function LandingPage() {
  return (
    <div className={styles.LandingPage}>
      <Grid container justify="space-around" className={styles.Grid}>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://upload.wikimedia.org/wikipedia/commons/5/56/David_Satcher_official_photo_portrait.jpg"
          />
          <Typography variant="h6" align="left">
            Our Initiative
          </Typography>
          <p>
            We convene staff from all divisions who help streamline coordination
            and foster collaboration of health equity efforts within the agency.
          </p>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX3311922.jpg"
          />
          <Typography variant="h6" align="left">
            Our Project
          </Typography>
          <p>
            Social determinants of health are conditions which influence
            individual and population health. For a health equity analysis, one
            must describe the connection between SDOH and health using
            well-documented research.
          </p>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://www.aamc.org/sites/default/files/Research-laboratory-993475228.jpg"
          />
          <Typography variant="h6" align="left">
            Our Impact
          </Typography>
          <p>
            We bring together health equity leaders, organizations and
            institutions from across the states, share best practices and
            identify common goals to advance health equity.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="left">
            Join our Efforts
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            COPD in the USA
          </Typography>
          <p>
            Florida has the highest cases of COPD in the united states.
            <br />
            <LinkWithStickyParams to={linkToMadLib("diabetes", { 1: 0 })}>
              <Button variant="outlined">Explore Data</Button>
            </LinkWithStickyParams>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="img/copd_usa.png"
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="img/penn_unemp.png"
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.GreenLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Unemployment in Pennsylvania
          </Typography>
          <p>
            County level look at where the highest rates of unemployment are in
            the state of Pennsylvania
            <br />
            <LinkWithStickyParams to={linkToMadLib("diabetes", { 1: 1 })}>
              <Button variant="outlined">Explore Data</Button>
            </LinkWithStickyParams>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Diabetes in American Indian/Alaska Native, non hispanic population
          </Typography>
          <p>
            Explore racial breakdowns of Diabetes data in the United States
            <br />
            <LinkWithStickyParams to={linkToMadLib("diabetes", { 1: 1 })}>
              <Button variant="outlined">Explore Data</Button>
            </LinkWithStickyParams>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="img/diabetes_amin.png"
          />
        </Grid>
        <Grid item xs={12} container className={styles.GreenLandingSquare}>
          <Grid item xs={12} sm={6}>
            <img
              height="300px"
              alt="placeholder"
              src="https://images-na.ssl-images-amazon.com/images/I/41dnPeFppOL._SX353_BO1,204,203,200_.jpg"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={styles.HomeLogo}>
              The Political Determints of Health
            </Typography>
            <p>
              Daniel Dawes argues that political determinants of health create
              the social drivers that affect all other dynamics of health. By
              understanding these determinants, we will be better equipped to
              implement actionable solutions to close the health gap.
              <Button variant="outlined">Explore Data</Button>
            </p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default LandingPage;
