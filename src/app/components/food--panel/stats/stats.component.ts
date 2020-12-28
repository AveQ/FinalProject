import {AfterViewChecked, AfterViewInit, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, DoCheck {
  summ;
  wrongData = false;
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
    this.userService.summ.subscribe(data => {
      if (data) {
        this.summ = data;
        for (let i = 0; i < 4; i++) {
          this.bars[i].max = this.summ[i].max;
          this.bars[i].value = this.summ[i].today;
          if (this.bars[i].max < this.bars[i].value) {
            this.bars[i].type = 'danger';
          } else {
            this.bars[i].type = 'success';
          }
          if (this.bars[i].max === 0) {
            this.wrongData = true;
          }
        }
      }
    });

  }

  constructor(private userService: UserService) {

  }


  ngDoCheck(): void {

  }


}
