import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  constructor(private navigationService: NavigationService, private sanitizer: DomSanitizer) {

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
    {
      name: 'Rozgrzewka',
      on: false
    },
  ];

  exerciseMok = [
    {
      id: 1,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'WYCISKANIE SZTANGI NA ŁAWECZCE SKOŚNEJ',
      favourite: true,
      typeOfExer: 'weight'
    },
    {
      id: 2,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'podnoszenie hantli sposobem młotkowym',
      favourite: false,
      typeOfExer: 'weight'
    },
    {
      id: 3,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'Martwy ciąg',
      favourite: false,
      typeOfExer: 'weight'
    },
    {
      id: 4,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'biceps',
      bigDesc: 'Przysiady',
      favourite: true,
      typeOfExer: 'weight'
    },
    {
      id: 5,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'cardio',
      bigDesc: 'Jazda na rowerze',
      favourite: false,
      typeOfExer: 'cardio'
    },
    {
      id: 6,
      img: 'assets/workout/DSC_3033.JPG',
      smallDesc: 'cardio',
      bigDesc: 'Bieganie na bieżni',
      favourite: true,
      typeOfExer: 'cardio'
    }
  ];



  nameOfExercise = 'Uginanie przedramion';
  muscle = 'Biceps';
  scaleOfDifficulty = 66;
  lvlOfDifficulty = 'Expert';
  colorOfDifficulty = 'success';
  kcal15min = 125;



  ngOnInit(): void {
    this.navigationService.changeNavSubject(3);
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
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
    switch (this.scaleOfDifficulty) {
      case 33: {
        this.setDifficulty('success', 33, 'Łatwy');
        break;
      }
      case 66: {
        this.setDifficulty('warning', 66, 'Trudny');
        break;
      }
      case 100: {
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
