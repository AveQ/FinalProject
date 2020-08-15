import {Component, HostListener, OnInit} from '@angular/core';
import {Meals} from '../models/meals.model';
import {MealMOK} from '../MOK/mealMOK.services';
import {MealsService} from '../services/meals.service';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-food-panel',
  templateUrl: './food-panel.component.html',
  styleUrls: ['./food-panel.component.scss']
})
export class FoodPanelComponent implements OnInit {
  currentDate = '27.07.20 - wtorek';
  date = new Date().toISOString().substr(0, 10);
  maxDate;
  minDate;
  meals = [];
  bars = [
    {
      name: 'Kcal',
      current: 1245,
      max: 2222
    },
    {
      name: 'Białko',
      current: 1245,
      max: 2222
    },
    {
      name: 'Tłuszcze',
      current: 1245,
      max: 2222
    },
    {
      name: 'Węglowodany',
      current: 1245,
      max: 2222
    }
  ];
  stat: boolean = false;
  isOpen = false;
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
  constructor(private mealMOK: MealMOK, private mealsService: MealsService) {
  }

  ngOnInit(): void {
    this.meals = this.mealMOK.meals;
    this.setMaxAndMinDate();
    this.mealsService.isMealOpen.subscribe(
      value => {
        this.isOpen = value;
        console.log(value);
      }
    );
  }

  setMaxAndMinDate() {
    this.minDate = new Date(new Date().getTime() - 86400000 * 30).toISOString().substr(0, 10);
    this.maxDate = new Date(new Date().getTime() + 86400000 * 30).toISOString().substr(0, 10);
  }

  addNewMeal() {
    this.mealMOK.addNewMeal();
  }

  dailyStatistics() {

  }
  openConfiguration() {
    this.mealsService.changeSidebar(false);
  }
}
