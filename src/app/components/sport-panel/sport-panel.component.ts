import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-food-panel',
  templateUrl: './sport-panel.component.html',
  styleUrls: ['./sport-panel.component.scss']
})
export class SportPanelComponent implements OnInit {
  filtersHidden = true;
  page = 1;
  partOfBody = 'Wybierz partię';
  isFront = false;
  constructor() {
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
