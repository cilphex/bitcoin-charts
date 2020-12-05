import React from 'react';

import Chart from 'components/Chart';

class LinearScaleChart extends Chart {
  constructor(props) {
    super(props);

    this.state = {
      maxDays: null,
    };
  }

  get chartView() {
    return <>
      Linear scale chart goes here.
    </>;
  }
}

export default LinearScaleChart;