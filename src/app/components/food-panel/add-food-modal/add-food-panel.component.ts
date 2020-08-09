import {Component, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-add-food-panel',
  templateUrl: './add-food-panel.component.html',
  styleUrls: ['./add-food-panel.component.scss']
})
export class AddFoodPanelComponent {
  foodsDb = [
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    },
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    },
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    },
  ];
  foodsUser = [
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    },
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    },
    {
      name: 'kaszanka',
      kcal: 123,
      macro: [
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
      ]
    }
  ];
  public pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'left',
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
}
