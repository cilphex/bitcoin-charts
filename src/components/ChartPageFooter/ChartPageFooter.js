import React from "react"
import styles from "./ChartPageFooter.scss"

class ChartPageFooter extends React.Component {
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
            <a href={sourceUrl} target="_blank">{sourceText}</a>
          </div>
        )}
        <div className={styles.footer}>
          <p className={styles.trueTilNot}>
            It's true until it's not.
            {' '}
            <span>But that might take a while.</span>
          </p>
          <p><a href="https://github.com/cilphex/bitcoin-never-look-back">Open source</a></p>
        </div>
      </div>
    )
  }
}

export default ChartPageFooter;