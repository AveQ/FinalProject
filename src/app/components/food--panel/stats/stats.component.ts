import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  bars = [
    {
      value: 30,
      max: 100,
      name: 'Kalorie',
      type: 'success'
    },
    {
      value: 50,
      max: 100,
      name: 'Proteiny',
      type: 'success'
    },
    {
      value: 40,
      max: 100,
      name: 'Tłuszcze',
      type: 'success'
    },
    {
      value: 10,
      max: 100,
      name: 'Węglowodany',
      type: 'success'
    }
  ];

  ngOnInit(): void {

  }

  constructor() {

  }

}
