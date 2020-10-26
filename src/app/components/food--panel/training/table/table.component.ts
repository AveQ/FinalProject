import { Component } from '@angular/core';

interface Training {
  id: number;
  hour: number;
  training: string[];
  burnKcal: number;
}

const Training: Training[] = [
  {
    id: 1,
    hour: 0,
    training: [
      'Jazda na rowerze',
      'Pływanie'
    ],
    burnKcal: 1200,
  },
  {
    id: 2,
    hour: 1,
    training: [
      'Bieganie'
    ],
    burnKcal: 600,
  }
];

@Component({
  selector: 'app-table',
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html'
})
export class NgbdTableBasic {

  trainings = Training;
  showMoreInfo(data) {
    console.log(data);
  }
}
