import React from 'react';
import Chart from "react-google-charts";

const colors = [
//
        '#a6cee3',
        '#fdbf6f',
        '#cab2d6',
        '#ffff99',
        '#1f78b4',
        '#33a02c',
        '#b2df8a',
        '#fb9a99'
//
/*
        'rgb(81, 110, 142)',//'#a6cee3',
        'rgb(38, 120, 81)',
        'rgb(41, 54, 71)',
        'rgb(135, 116, 31)',
        'rgb(118, 72, 142)',
        '#ffff99',
        '#1f78b4',
        '#33a02c'

*/
      ];


export default class SankeyChart extends React.Component {
  /*/
  constructor(props) {
    super(props);
  }
  /*/

  render() {
    return (
      <Chart
        height={this.props.height}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={this.props.data}
        options = {{
          sankey: {
            node: {
              colors: colors
            },
            link: {
              colorMode: 'gradient',
              colors: colors
            }
          }
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    );
  }
}
