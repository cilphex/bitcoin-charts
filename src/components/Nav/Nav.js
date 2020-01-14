import React from "react"
import { Link, withRouter } from "react-router-dom";
import styles from "./Nav.scss"

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pathname } = this.props.location;

    const linkClasses = ({
      home: '/',
      nlb: '/never-look-back',
      plc: '/power-law-corridor'
    });

    Object.keys(linkClasses).forEach(key =>
      linkClasses[key] = pathname === linkClasses[key] ? styles.selected : ''
    );

    return (
      <div className={styles.wrapper}>
        <div className={styles.navigation}>
          <Link to="/" className={`${styles.home} ${linkClasses.home}`}>
            <span />
            <span />
            <span />
          </Link>
          <Link to="/never-look-back" className={linkClasses.nlb}>NLB</Link>
          <Link to="/power-law-corridor" className={linkClasses.plc}>PLC</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Nav)