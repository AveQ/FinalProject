import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ExerciseModel} from '../../../model/exercise.model';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../services/auth.service';
import * as _ from 'lodash';
import {ExerciseService} from '../../../services/exercise.service';
import {UserService} from '../../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit, OnDestroy {
  /*http://localhost:3000/*/
  imageAddress = 'https://nfl-center-api.herokuapp.com/';
  exerciseId;
  user;
  userId;
  isLoading = true;
  openExer = false;
  // wyszukana historia
  historyExercise;
  lvlOfDifficulty = 'Expert';
  scaleOfDifficulty = 66;
  colorOfDifficulty = 'success';
  selectedExercise: ExerciseModel = {
    _id: '0',
    name: '0',
    namePL: '',
    type: '0',
    description: '0',
    descriptionPL: '',
    rate: {
      counter: 0,
      sum: 0,
      rate: 0
    },
    popular: 0,
    musclePart: '0',
    image: '0',
    video: '0',
    difficult: 0,
    kcalRatio: 0
  };
  hideForm = false;
  hideRate = false
  model: NgbDateStruct = {
    year: 0,
    month: 0,
    day: 0
  };
  private newUserHistory = {
    idUser: '',
    date: 0,
    kcal: 0,
    time: 666,
    exercises: []
  };
  timeModel = 30;
  error = false;
  isRated = false;
  myRate = 1;
  private allUserHistory;
  language = 'pl';

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private exerciseService: ExerciseService,
              private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Exercise | NFL-Center');
    this.language = this.translate.currentLang;
    this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
          this.userId = user.user.id;
        }
      }
    );
    this.route.params.subscribe(
      (params: Params) => {
        this.exerciseId = params.active;
      }
    );
    this.loadExercise();
    console.log(this.selectedExercise.musclePart);
  }

  createArrayForYellowStars(n: number): any[] {
    if (n) {
      return Array(n);
    } else {
      return Array(0);
    }
  }

  createArrayForGreyStars(n: number): any[] {

    if (n) {
      return Array(5 - n);
    } else {
      return Array(5);
    }
  }

  setSelectedHistory(day, month, year) {
    this.historyExercise = _.find(this.allUserHistory, data => {
      // ustaw posilki
      if (day === new Date(data.date).getDate() &&
        month === new Date(data.date).getMonth() &&
        year === new Date(data.date).getFullYear()) {
        return data;
      }
    });
    if (_.isEmpty(this.historyExercise)) {
      this.newUserHistory.date = new Date(year, month, day).getTime();
      this.newUserHistory.idUser = this.userId;
      this.exerciseService.postUserHistory(this.newUserHistory).subscribe(
        history => {
        },
        error => {
        },
        () => {
          console.log('new history');
          this.loadUserAllHistory();
          this.setSelectedHistory(day, month, year);
        }
      );
    } else {
      this.patchNewExe();
    }
  }

  sendDateToPatch() {
    const date = new Date(this.model.year + '-' + this.model.month + '-' + this.model.day);
    if (!isNaN(date.getTime()) && (this.timeModel > 0)) {
      const month = date.getMonth();
      const day = date.getDate();
      const year = date.getFullYear();
      if (this.model.year >= 2020 && this.model.year !== 0 ||
        this.model.day !== 0 || this.model.month !== 0 &&
        date.toString() !== 'Invalid date') {
        this.setSelectedHistory(day, month, year);
      } else {
        this.error = true;
      }
    } else {
      this.error = true;
    }
  }

  changeRate(stars) {
    this.myRate = stars + 1;
  }

  sendComment() {
    if (!this.isRated) {
      const newRate = this.selectedExercise.rate;
      newRate.counter++;
      newRate.sum = newRate.sum + this.myRate;
      newRate.rate = +(newRate.sum / newRate.counter).toFixed(0);
      this.user.user.isRated.push(this.selectedExercise._id);
      this.exerciseService.patchExercise(this.selectedExercise._id, 'rate', newRate).subscribe(
        data => {
        }
      );
      this.userService.patchUserFavExercises(this.userId, 'isRated', this.user.user.isRated).subscribe();
      this.isRated = true;
    }
  }

  loadExercise() {
    this.isLoading = true;
    this.openExer = true;
    this.exerciseService.getExercise(this.exerciseId).subscribe(
      data => {
        if (data) {
          this.selectedExercise = data;
          this.checkIsRated();
          this.patchPopularValue();
          console.log(this.selectedExercise);
        }
      },
      error => {
        this.router.navigate(['/atlas']);
      },
      () => {
        this.checkDifficulty();
        this.isLoading = false;
      }
    );

  }

  patchPopularValue() {
    this.selectedExercise.popular++;
    this.exerciseService.patchExercise(this.selectedExercise._id, 'popular', this.selectedExercise.popular).subscribe();
  }

  checkDifficulty() {
    switch (this.selectedExercise.difficult) {
      case 0: {
        this.setDifficulty('success', 33, 'Łatwy');
        break;
      }
      case 1: {
        this.setDifficulty('warning', 66, 'Trudny');
        break;
      }
      case 2: {
        this.setDifficulty('danger', 100, 'Expert');
        break;
      }
      default: {
        this.setDifficulty('success', 33, 'Łatwy');
      }
    }
  }

  setDifficulty(color, scale, lvl) {
    this.scaleOfDifficulty = scale;
    this.lvlOfDifficulty = lvl;
    this.colorOfDifficulty = color;
  }


  patchNewExe() {
    let kcalRatio = 0;
    let kcal = 0;
    const tempArray = this.historyExercise.exercises;
    const newExercise = {
      kcal: 0,
      time: -1,
      idExercise: ''
    };
    const weight = this.user.user.weight;
    this.exerciseService.getExercise(this.exerciseId).subscribe(
      data => {
        kcalRatio = data.kcalRatio;
      }, error => {
      },
      () => {
        kcal = kcalRatio * this.timeModel * weight;
        newExercise.kcal = +kcal.toFixed(2);
        newExercise.time = this.timeModel;
        newExercise.idExercise = this.exerciseId;
        // sprawdz czy juz taki rodzaj cwiczenia wystepuje w historii jak tak to ja update
        const indexTemp = _.findIndex(tempArray, ['idExercise', this.exerciseId]);
        if (indexTemp !== -1) {
          tempArray[indexTemp] = newExercise;
        } else {
          tempArray.push(newExercise);
        }
        this.exerciseService.patchUserHistory(this.historyExercise._id, 'exercises', tempArray).subscribe(
          data => {
          },
          error => {
          },
          () => {
            console.log('Patch successful');

            this.router.navigate(['./timeline-exercise']);
          }
        );
      }
    );
  }

  // sprawdź czy id cwiczenia znajduje sie w liscie ocenionych id przez uzytkownika
  checkIsRated() {
    // ustaw flage jezeli wystepuje w tablicy
    this.isRated = this.user.user.isRated.length !== 0 && (_.findIndex(this.user.user.isRated, data => {
      return data === this.selectedExercise._id;
    }) !== -1);
  }

  loadUserAllHistory() {
    if (this.user) {
      this.exerciseService.loadUserAllHistory(this.userId).subscribe(
        data => {
          this.allUserHistory = data;
        },
        error => {
        },
        () => {
        }
      );
    }
  }

  ngOnDestroy(): void {
  }
}

