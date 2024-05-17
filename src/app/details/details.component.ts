import { Component, OnInit } from '@angular/core';
import * as echarts from "echarts";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  myChart1: any
  myChart2: any

  constructor() { }

  ngOnInit(): void {
    this.generateChart()
  }


  generateChart(){
    this.myChart1 = echarts.init(document.getElementById("chart1") as any);
    this.myChart2 = echarts.init(document.getElementById("chart2") as any);

    let base = +new Date(1968, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let date = [];

    let data = [Math.random() * 300];

    for (let i = 1; i < 20000; i++) {
      var now = new Date((base += oneDay));
      date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
      data.push(Math.abs(Math.round((Math.random() - 0.5) * 20 + data[i - 1])));
    }

    let option1 = {
      tooltip: {
        trigger: 'axis',
        position: function (pt:any) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'left',
        text: 'Present Day'
      },
      legend: {
        data: ["Time for morning till now", "People Count"],
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: 'People Count',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          data: data
        }
      ]
    };

    let option2 = {
      tooltip: {
        trigger: 'axis',
        position: function (pt:any) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'left',
        text: 'Last 30 Days'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        data: ["Time for morning till now", "People Count"],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: 'People Count',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(115, 100, 500)'
          },
          data: data
        }
      ]
    };

    this.myChart1.setOption(option1);
    this.myChart2.setOption(option2);

  }

}
