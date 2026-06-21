import React from 'react';
import ReactECharts from 'echarts-for-react';


const SpkEcharts = ({ chartOptions, chartSeries, mainClass="", height, width, id }) => {

  return (
    <ReactECharts option={{ ...chartOptions, series: chartSeries }} style={{ height, width }} key={id} className={mainClass} />
  );

};

export default SpkEcharts;
