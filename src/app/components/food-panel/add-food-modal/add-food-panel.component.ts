import {Component, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {MealsService} from '../../services/meals.service';

@Component({
  selector: 'app-add-food-panel',
  templateUrl: './add-food-panel.component.html',
  styleUrls: ['./add-food-panel.component.scss']
})
export class AddFoodPanelComponent implements OnInit {
  page = 1;
  stat: boolean = true;
  isOpen = true;
  productProp = true;
  constructor(private mealsService: MealsService) {
  }

  products = [
    {
      name: 'Jajcznica',
      kcal: 123,
      macro:
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
    },
    {
      name: 'Kaszanka',
      kcal: 123,
      macro:
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
    },
    {
      name: 'Szynka',
      kcal: 123,
      macro:
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
    },
    {
      name: 'Filet z Kurczaka',
      kcal: 123,
      macro:
        {
          id: 12234,
          carb: 32,
          fats: 22,
          prot: 123
        }
    }
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

  ngOnInit(): void {
    this.mealsService.isMealOpen.subscribe(
      value => {
        this.isOpen = value;
        console.log(value);
      }
    );
  }
  closeModal() {
    this.mealsService.changeSidebar(false);
    this.productProp = true;
  }
}
