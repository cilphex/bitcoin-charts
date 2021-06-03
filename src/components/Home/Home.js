import React from "react"
import { Link } from "react-router-dom";
import appStyles from 'app.scss';
import styles from "./Home.scss"

export default function() {
  return (
    <div className={appStyles.contentColumn}>
      <h1>Bitcoin Charts</h1>
      <div className={appStyles.textBlock}>
        <p>Money is a self-organizing system of resource management.</p>
        <p>Bitcoin is better money, because it allows for more pure
        self-organization as a result of its money supply being predetermined by
        hard-coded, low-inflation algorithm &mdash; rather than by fiat decree.</p>
      </div>

      <div className={styles.links}>
        <Link to="/never-look-back">Never Look Back Price</Link>
        <Link to="/power-law-corridor">Power Law Corridor</Link>
      </div>
    </div>
  )
}