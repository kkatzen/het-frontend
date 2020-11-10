import React from "react";
import styles from "./LandingPage.module.scss";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
            individual and population helath. For a health equity analysis, one
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
            identify com,mon golas to advance health equity.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="left">
            Join our Efforts
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Covid Data for Virgina
          </Typography>
          <p>
            As of Friday morning, there have been at elast 178,183 cases and
            3,636 deaths in Virginia since the beginning of the pandemic.
            <br />
            <Button variant="outlined">Explore Data</Button>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="https://eazybi.com/static/img/blog/posts/2016_03_01/data_visualization_column_chart.png"
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="https://eazybi.com/static/img/blog/posts/2016_03_01/data_visualization_column_chart.png"
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.GreenLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Diabetes Data
          </Typography>
          <p>
            The complications from this data are coronary heart disease,
            congestive heart failure, chronic kidney disease and peripheral
            vascular disease.
            <br />
            <Button variant="outlined">Explore Data</Button>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Obesity Data
          </Typography>
          <p>
            Learn about behavioral, policy and environmental indicators that
            affect childhood obesity, fruit and vegetable consumption, physical
            activity and breastfeeding.
            <Button variant="outlined">Explore Data</Button>
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <img
            height="300px"
            width="300px"
            alt="placeholder"
            src="https://eazybi.com/static/img/blog/posts/2016_03_01/data_visualization_column_chart.png"
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
