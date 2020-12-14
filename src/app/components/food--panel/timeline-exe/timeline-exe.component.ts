import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {TimeService} from '../../../services/time.service';
import {ExerciseService} from '../../../services/exercise.service';
import * as _ from 'lodash';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline-exe.component.html',
  styleUrls: ['./timeline-exe.component.scss']
})
export class TimelineExeComponent implements OnInit, OnDestroy {
  activeMenuCategory = 0;
  updateMeal = false;
  myNavSubject: Subscription;
  todayHistory;
  private newUserHistory = {
    idUser: '',
    date: 0,
    kcal: 0,
    time: 666,
    exercises: []
  };
  exercises = [];
  currentDay;
  nextDay;
  previousDay;
  finalExerciseArray = [];
  private userSubscription;
  private user;
  private userId;
  private allUserHistory;

  constructor(private navigateService: NavigationService,
              private timeService: TimeService,
              private exercise: ExerciseService,
              private authService: AuthService) {
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
    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
          this.userId = user.user.id;
        }
      }
    );
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
    this.loadUserAllHistory();
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

  loadUserAllHistory() {
    if (this.user) {
      this.exercise.loadUserAllHistory(this.userId).subscribe(
        data => {
          this.allUserHistory = data;
        },
        error => {
        },
        () => {
          this.setTodayHistory();
        }
      );
    }
  }

  setTodayHistory() {

    this.todayHistory = _.find(this.allUserHistory, data => {
      // ustaw posilki
      if (new Date(this.currentDay.time).getDate() === new Date(data.date).getDate() &&
        new Date(this.currentDay.time).getMonth() === new Date(data.date).getMonth()) {
        return data;
      }
    });
    if (_.isEmpty(this.todayHistory)) {
      this.newUserHistory.date = new Date().getTime();
      this.newUserHistory.idUser = this.userId;
      this.exercise.postUserHistory(this.newUserHistory).subscribe(
        history => {
        },
        error => {
        },
        () => {
          console.log('create new hisotry');
          this.loadUserAllHistory();
        }
      );
    } else {
      this.configExercise();
    }
  }

  configExercise() {
    const tempExercises = this.todayHistory.exercises;
    let tempObject = {};
    for (const exer in tempExercises) {
      if (tempExercises.hasOwnProperty(exer)) {
        this.exercise.getExercise(tempExercises[exer].idExercise).subscribe(
          data => {
            tempObject = {
              id: data.id,
              name: data.name,
              kind: data.type,
              time: tempExercises[exer].time,
              burn: tempExercises[exer].kcal
            };
            this.exercises.push(tempObject);
          }
        )
      }
    }
    console.log(tempExercises)
  }

  ngOnDestroy(): void {
    this.changeMealStatus(false);
    this.myNavSubject.unsubscribe();
  }
}
