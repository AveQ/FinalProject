import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  nameOfExercise: string = 'Uginanie przedramion';
  muscle: string = 'Biceps';
  scaleOfDifficulty: number = 66;
  lvlOfDifficulty: string = 'Expert';
  colorOfDifficulty: string = 'success';
  kcal15min: number = 125;
  constructor() {
  }

  ngOnInit(): void {
    this.checkDifficulty();
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

}
