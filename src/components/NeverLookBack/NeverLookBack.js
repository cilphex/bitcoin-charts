import React from 'react';
import BasicChart from './components/BasicChart';

class NeverLookBack extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
  }

  render() {
    return (
      <div>
        <h1>Example chart: Bitcion price over time</h1>
        <p className="intro">
          As described in {' '}
          <a href="https://www.caneislandcrypto.com/blog/2019/10/5/why-bitcoin-is-never-looking-back">this article</a>
          {' '} by {' '}
          <a href="https://twitter.com/nsquaredcrypto">Timothy Peterson</a>
        </p>

        <h2>Basic NLB</h2>
        <BasicChart dataStore={this.dataStore} />
      </div>
    );
  }
}

export default NeverLookBack;