import React from "react"
import { Link } from "react-router-dom";
import styles from "./Home.scss"

export default function() {
  return (
    <div>
      <h1>Bitcoin Charts</h1>
      <div className={styles.links}>
        <Link to="/never-look-back">Never Look Back Price</Link>
        <Link to="/power-law-corridor">Power Law Corridor</Link>
      </div>

      <br />
      <br />
      <br />
      <p>Money is a self-organizing system of resource management.</p>
    </div>
  )
}