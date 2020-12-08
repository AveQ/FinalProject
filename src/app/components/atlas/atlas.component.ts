import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ExerciseService} from '../../services/exercise.service';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExerciseModel} from '../../model/exercise.model';

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
    private router: Router) {

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
  exerciseMok = [
    {
      id: 1,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'WYCISKANIE SZTANGI NA ŁAWECZCE SKOŚNEJ',
      favourite: true,
      typeOfExer: 'weight',
      rate: 1
    },
    {
      id: 2,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'podnoszenie hantli sposobem młotkowym',
      favourite: false,
      typeOfExer: 'weight',
      rate: 2
    },
    {
      id: 3,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'Martwy ciąg',
      favourite: false,
      typeOfExer: 'weight',
      rate: 3
    },
    {
      id: 4,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'Przysiady',
      favourite: true,
      typeOfExer: 'weight',
      rate: 1
    },
    {
      id: 5,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'cardio',
      bigDesc: 'Jazda na rowerze',
      favourite: false,
      typeOfExer: 'cardio',
      rate: 2.3
    },
    {
      id: 6,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'cardio',
      bigDesc: 'Bieganie na bieżni',
      typeOfExer: 'cardio',
      rate: 4.5
    }
  ];


  nameOfExercise = 'Uginanie przedramion';
  muscle = 'Biceps';
  scaleOfDifficulty = 66;
  lvlOfDifficulty = 'Expert';
  colorOfDifficulty = 'success';
  kcal15min = 125;
  exerciseId = '0';
  paramsSubscription: Subscription;
  ngOnInit(): void {
    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => { this.exerciseId = params.exerciseId; }
    );
    this.exerciseService.getAllExercises().subscribe(
      data => {
        this.exercises = data.exercises;
        console.log(this.exercises);
      },
      err => {

      },
      () => {
      }
    );
    if (this.exerciseId !== undefined) {
      this.loadExercise();
    }
    this.navigationService.changeNavSubject(3);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
  }

  loadExercise() {
    this.openExer = true;
    this.exerciseService.getExercise(this.exerciseId).subscribe(
      data => {
        this.selectedExercise = data;
      },
      error => {},
      () => { this.checkDifficulty(); }
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

  animationHeart(element: HTMLElement) {
    this.heartAnimation = !this.heartAnimation;
    element.classList.contains('fa-heart-active') ? element.classList.remove('fa-heart-active') : element.classList.add('fa-heart-active');
    element.classList.add('fa-heart-animation');
    setTimeout(() => {
      element.classList.remove('fa-heart-animation');
    }, 1000);
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
