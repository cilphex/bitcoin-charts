import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import DataStore from "stores/DataStore";
import styles from "./Nav.scss";

@observer
class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      location: PropTypes.object,
      dataStore: PropTypes.instanceOf(DataStore),
    };
  }

  render() {
    const { pathname } = this.props.location;
    const { chartData } = this.props.dataStore;

    const linkClasses = ({
      home: "/",
      nlb: "/never-look-back",
      plc: "/power-law-corridor",
      wma: "/weekly-moving-average",
    });

    Object.keys(linkClasses).forEach(key =>
      linkClasses[key] = pathname === linkClasses[key] ? styles.selected : ""
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
          <Link to="/weekly-moving-average" className={linkClasses.wma}>WMA</Link>

          {!chartData && (
            <div className={styles.loading}>
              Loading
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Nav);
