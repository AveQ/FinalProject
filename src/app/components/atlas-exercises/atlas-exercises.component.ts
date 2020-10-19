import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-atlas-exercises',
  templateUrl: './atlas-exercises.component.html',
  styleUrls: ['./atlas-exercises.component.scss']
})
export class AtlasExercisesComponent implements OnInit {
  filtersHidden = true;
  page = 1;
  partOfBody = 'Wybierz partię';
  isFront = false;
  constructor() {
  }

  basicSportMenu = [
    {
      name: 'Wiedza podstawowa',
      on: true
    },
    {
      name: 'Ćwiczenia',
      on: false
    },
    {
      name: 'Rozgrzewka',
      on: false
    },
  ];

  ngOnInit(): void {
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
}
