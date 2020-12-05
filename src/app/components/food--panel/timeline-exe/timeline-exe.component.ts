import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {TimeService} from '../../../services/time.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline-exe.component.html',
  styleUrls: ['./timeline-exe.component.scss']
})
export class TimelineExeComponent implements OnInit, OnDestroy {
  activeMenuCategory = 0;
  updateMeal = false;
  myNavSubject: Subscription;
  exercises = [
    {
      id: 1,
      name: 'bieganie',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 2,
      name: 'rowerek',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 3,
      name: 'kajak',
      kind: 'Cardio',
      time: 160,
      burn: 540
    },
    {
      id: 4,
      name: 'wyciskanie na ławce skośnej',
      kind: 'Siłowe',
      time: 160,
      burn: 540
    }
  ];
  currentDay;
  nextDay;
  previousDay;
  finalExerciseArray = [];

  constructor(private navigateService: NavigationService,
              private timeService: TimeService) {
  }

  setFilter(value) {
    this.finalExerciseArray = [];
    if (value === 'wszystkie') {
      this.finalExerciseArray = this.exercises;
    } else {
      this.exercises.find(element => {
        if (element.kind === value) {
          this.finalExerciseArray.push(element);
        }
      });
    }
  }

  ngOnInit(): void {
    this.timeService.setMaxAndMinDate();
    const createDate = this.timeService.setDate(new Date().getTime());
    this.currentDay = createDate[0];
    this.previousDay = createDate[1];
    this.nextDay = createDate[2];
    this.myNavSubject = this.navigateService.returnMealSubject().subscribe(
      value => {
        this.updateMeal = value;
      }
    );
    this.navigateService.changeNavSubject(2);
    this.finalExerciseArray = this.exercises;
  }

  changeMealStatus(value) {
    this.navigateService.changeMealSubject(value);
  }

  changeDate(date, status: boolean) { // false - previous date, true - next date
    const createDate = this.timeService.changeDate(date, status);
    this.currentDay = createDate[0];
    this.previousDay = createDate[1];
    this.nextDay = createDate[2];
  }


  ngOnDestroy(): void {
    this.changeMealStatus(false);
    this.myNavSubject.unsubscribe();
  }
}
