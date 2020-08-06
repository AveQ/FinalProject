import {Component, OnInit} from '@angular/core';
import {ChartType, ChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';



@Component({
  selector: 'app-daily-statistics',
  templateUrl: './daily-statistics.component.html',
  styleUrls: ['./daily-statistics.component.scss']
})
export class DailyStatisticsComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Węglowodany', 'Białko', 'Tłuszcze'];
  public pieChartData: number[] = [20, 20, 60];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(5,0,37,0.3)', 'rgba(0,255,19,0.58)', 'rgba(255,0,8,0.58)'],
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
