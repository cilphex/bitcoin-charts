import React from "react";
import PropTypes from "prop-types";
import styles from "./ChartPageFooter.scss";

class ChartPageFooter extends React.Component {
  static get propTypes() {
    return {
      sourceQuote: PropTypes.string,
      sourceUrl: PropTypes.string,
      sourceText: PropTypes.string,
    };
  }

  render() {
    const {
      sourceQuote,
      sourceUrl,
      sourceText,
    } = this.props;

    return (
      <div>
        { sourceUrl && (
          <div className={styles.credits}>
            { sourceQuote && (
              <p>&ldquo;{sourceQuote}&rdquo;</p>
            )}
            <a href={sourceUrl} target="_blank" rel="noreferrer">{sourceText}</a>
          </div>
        )}
        <div className={styles.footer}>
          <p className={styles.trueTilNot}>
            It's true until it's not.
            {" "}
            <span>But that might take a while.</span>
          </p>
          <p><a href="https://github.com/cilphex/bitcoin-charts">Open source</a></p>
        </div>
      </div>
    );
  }
}

export default ChartPageFooter;
