import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ExerciseService} from '../../services/exercise.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExerciseModel} from '../../model/exercise.model';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-atlas',
  templateUrl: './atlas.component.html',
  styleUrls: ['./atlas.component.scss']
})
export class AtlasComponent implements OnInit, OnDestroy {
  filtersHidden = true;
  page = 1;
  partOfBody = 'Wybierz partię';
  isFront = false;
  heartAnimation = false;
  safeSrc: SafeResourceUrl;
  videoURL = 'https://www.youtube.com/embed/3vJHQjiEp1w';
  openExer = false;
  selectedExercise: ExerciseModel = {
    id: '0',
    name: '0',
    type: '0',
    description: '0',
    rate: 0,
    popular: 0,
    musclePart: '0',
    image: '0',
    video: '0',
    difficult: 0
  };

  constructor(
    private navigationService: NavigationService,
    private sanitizer: DomSanitizer,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {
  }

  basicSportMenu = [
    {
      name: 'Wiedza podstawowa',
      on: false
    },
    {
      name: 'Ćwiczenia',
      on: true
    },
  ];
  exercises;

  scaleOfDifficulty = 66;
  lvlOfDifficulty = 'Expert';
  colorOfDifficulty = 'success';
  kcal15min = 125;
  exerciseId = '0';
  paramsSubscription: Subscription;
  user;
  favUserExercises = [];

  ngOnInit(): void {

    // pobierz dane o użytkowniku
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          this.favUserExercises = this.user.user.userFavExercises;
          console.log(this.favUserExercises);
        }
      },
      error => {
      },
      () => {
      }
    );
    // pobierz cwiczenia
    this.getExercises();
    // sledz sciezke
    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.exerciseId = params.exerciseId;
      }
    );
    if (this.exerciseId !== undefined) {
      this.loadExercise();
    }
    this.navigationService.changeNavSubject(3);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
  }

  getExercises() {
    this.exerciseService.getAllExercises().subscribe(
      data => {
        this.exercises = data.exercises;
      },
      err => {

      },
      () => {
        this.favUserExercises = this.user.user.userFavExercises;
        for (const exer in this.exercises) {
          if (this.exercises.hasOwnProperty(exer)) {
            // sprawdz ktore cwiczenia sa ulubione i daj serduszko
            this.exercises[exer].favourite = !!this.favUserExercises.find(data => {
              return data === this.exercises[exer]._id;
            });
          }
        }
      }
    );
  }

  loadExercise() {
    this.openExer = true;
    this.exerciseService.getExercise(this.exerciseId).subscribe(
      data => {
        this.selectedExercise = data;
      },
      error => {
      },
      () => {
        this.checkDifficulty();
      }
    );
  }

  openExercise(value) {
    console.log(value);
    this.router.navigate(
      ['/atlas'],
      {
        queryParams: {exerciseId: value},
        queryParamsHandling: 'merge'
      });
    this.exerciseId = value;
    this.loadExercise();
  }

  closeExercise() {
    this.router.navigate(['/atlas']);
    this.openExer = !this.openExer;
  }

  animationHeart(element: HTMLElement, exerciseId) {
    const index = this.favUserExercises.findIndex(data => data === exerciseId);
    if (index === -1) {
      this.favUserExercises.push(exerciseId);
      this.updateDataFavExercise();
    } else {
      this.favUserExercises.splice(index, 1);
      console.log(this.favUserExercises);
      this.updateDataFavExercise();
    }
    // zeby aktualizowac dane przechowywane lokalnie
    const tempUser = this.authService.user.getValue();
    tempUser.user.userFavExercises = this.favUserExercises;
    localStorage.setItem('userData', JSON.stringify(tempUser));
    this.authService.user.next(tempUser);
    // animacja
    this.heartAnimation = !this.heartAnimation;
    element.classList.contains('fa-heart-active')
      ? element.classList.remove('fa-heart-active') : element.classList.add('fa-heart-active');
    element.classList.add('fa-heart-animation');
    setTimeout(() => {
      element.classList.remove('fa-heart-animation');
    }, 1000);
  }

  downloadFavExercise(id) {
    this.userService.getUserFavExercises(id).subscribe(
      data => {
        this.favUserExercises = data.user.userFavExercises;
      }, error => {
      },
      () => {
      }
    );
  }

  updateDataFavExercise() {
    console.log(this.favUserExercises);
    this.userService.patchUserFavExercises(this.user.user.id, 'userFavExercises', this.favUserExercises)
      .subscribe(
        data => {
        }, error => {
        }, () => {
        }
      );
  }

  changeCategory(index) {
    this.basicSportMenu.map(x => {
      x.on = false;
    });
    this.basicSportMenu[index].on = true;
  }

  sayMyName(value) {
    console.log(value);
    this.partOfBody = value;
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


  ngOnDestroy(): void {
  }
}
