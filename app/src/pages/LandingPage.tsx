import React from "react";
import styles from "./LandingPage.module.scss";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function LandingPage() {
  return (
    <div className={styles.LandingPage}>
      <Grid container justify="space-around" className={styles.Grid}>
        <Grid container justify="space-around">
          <Grid item xs={6} className={styles.BlueLandingSquare}>
            <Typography variant="h6" className={styles.HomeLogo}>
              OUR INITIATIVE.
            </Typography>
            <p>
              We aim to create a collaborative, multidisciplinary, multisector,
              public-facing data platform devoted to addressing the health
              equity implications for vulnerable populations during the COVID-19
              pandemic, and develop standardized, evidence-based, best practices
              for developing socio-culturally responsive guidelines, resources,
              toolkits, and evaluation metrics for mitigating COVID-19 disparate
              outcomes for vulnerable populations and to provide technical
              assistance to health organizations, including state and local
              jurisdictions’ COVID-19 responses.
            </p>
          </Grid>
          <Grid item xs={6} className={styles.LandingSquare}>
            <img
              height="300px"
              alt="placeholder"
              src="https://upload.wikimedia.org/wikipedia/commons/5/56/David_Satcher_official_photo_portrait.jpg"
            />
          </Grid>
        </Grid>
        <Grid container justify="space-around">
          <Grid item xs={6} className={styles.LandingSquare}>
            <img
              height="300px"
              alt="placeholder"
              src="https://images-na.ssl-images-amazon.com/images/I/41dnPeFppOL._SX353_BO1,204,203,200_.jpg"
            />
          </Grid>
          <Grid item xs={6} className={styles.GreenLandingSquare}>
            <Typography variant="h6" className={styles.HomeLogo}>
              OUR PROJECT.
            </Typography>
            <p>
              Examining the political determinants of health by creating a
              comprehensive, interactive, public-facing COVID-19 Health Equity
              Map of the United States and its territories, inclusive of all
              racial population groups. This project analyzes jurisdictional
              policies that either exacerbate or alleviate COVID-19 outcomes,
              comorbidities, resource allocation/management, jurisdictions’
              response, and mitigation strategies, testing, and contact tracing,
              and overall implications for health equity for vulnerable
              populations. The project allows us to not only understand and
              share policy research on racial and ethnic and socioeconomic
              disparities but to understand and share information on the
              mental/behavioral health equity impact of COVID-19.
            </p>
          </Grid>
        </Grid>
        <Grid container justify="space-around">
          <Grid item xs={6} className={styles.BlueLandingSquare}>
            <Typography variant="h6" className={styles.HomeLogo}>
              OUR IMPACT.
            </Typography>
            <p>
              Benchmarking equity to create actionable evidence-based policy
              responses by engaging with diverse communities across the country
              to develop policy templates for local, state, and federal
              policymakers, and develop and publish a state-by-state report card
              or county-by-county report card based on five to ten
              objectives/thresholds determined by a national panel of experts
              under our COVID-19 Health Equity Commission (CHEC). The project
              creates a special track in HELEN focused on coordinating COVID-19
              community engagement, education, training, information exchange
              and dissemination, policy analysis, and advocacy.
            </p>
          </Grid>
          <Grid item xs={6} className={styles.LandingSquare}>
            <img
              height="300px"
              alt="placeholder"
              src="https://pbs.twimg.com/profile_images/687736562419904514/NtcJ-n6F.jpg"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default LandingPage;
