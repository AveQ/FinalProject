import {Component, HostListener, OnInit} from '@angular/core';
import {Meals} from '../models/meals.model';
import {MealMOK} from '../MOK/mealMOK.services';
import {MealsService} from '../services/meals.service';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

class Day {
  name: string;
  date: string;
  time: number;
}

enum Days {
  'Niedziela' = 0,
  'Poniedziałek' = 1,
  'Wtorek' = 2,
  'Środa' = 3,
  'Czwartek' = 4,
  'Piątek' = 5,
  'Sobota' = 6
}

@Component({
  selector: 'app-food-panel',
  templateUrl: './food-panel.component.html',
  styleUrls: ['./food-panel.component.scss']
})
export class FoodPanelComponent implements OnInit {
  currentDate = '27.07.20 - wtorek';
  private counter = 0;
  private maxDays = 30;
  currentDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  nextDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  previousDay: Day = {
    name: '',
    date: '',
    time: 0
  };
  maxDate;
  minDate;
  meals = [];
  bars = [
    {
      name: 'Kalorie',
      current: 1245,
      max: 223322,
      value: 80,
      type: 'success'
    },
    {
      name: 'Białko',
      current: 1245,
      max: 2222,
      value: 35,
      type: 'success'
    },
    {
      name: 'Tłuszcze',
      current: 1245,
      max: 2222,
      value: 90,
      type: 'danger'
    },
    {
      name: 'Węglow.',
      current: 1245,
      max: 2222,
      value: 23,
      type: 'success'
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
    this.setDate(new Date().getTime());
    console.log(this.meals)
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
    this.mealsService.changeSidebar(true);
  }

  setDate(date) {
    // if date is not more or smaller than current date do it
      // enum
      const days = Days;
      // time
      this.currentDay.time = new Date(date).getTime();
      this.nextDay.time = this.currentDay.time + 86400000;
      this.previousDay.time = this.currentDay.time - 86400000;
      // date
      this.currentDay.date = this.calcDate(this.currentDay.time);
      this.nextDay.date = this.calcDate(this.nextDay.time);
      this.previousDay.date = this.calcDate(this.previousDay.time);
      // name
      this.currentDay.name = days[(new Date(this.currentDay.time).getDay())];
      this.nextDay.name = days[(new Date(this.nextDay.time).getDay())];
      this.previousDay.name = days[(new Date(this.previousDay.time).getDay())];
  }

  calcDate(time) {
    return new Date(time).toISOString().substr(8, 2)
      + '.' +
      new Date(time).toISOString().substr(5, 2);
  }

  changeDate(date, status: boolean) { // false - previous date, true - next date
    if (this.counter < this.maxDays && status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    } else if (this.counter > (-this.maxDays) && !status) {
      status ? this.setDate(date + 86400000) : this.setDate(date - 86400000);
      status ? this.counter++ : this.counter--;
    }
  }
  stats() {
    console.log('x')
  }
}
