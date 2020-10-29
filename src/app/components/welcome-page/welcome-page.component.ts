import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  activePage = 0;
  idInterval;
  progressBarActive = false;

  constructor(private navigateService: NavigationService) {
  }

  ngOnInit(): void {
    this.progressBarActive = true;
    this.bgInterval();
    this.navigateService.changeNavSubject(0);
  }

  bgInterval() {
    this.idInterval = setInterval(() => {
      if (this.activePage === 2) {
        this.activePage = 0;
      } else {
        this.activePage = this.activePage + 1;
      }
    }, 5000);
    this.progressBarActive = true;
  }

  setManuallyNewBackground(value) {
    this.progressBarActive = false;
    this. activePage = value;
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
    this.bgInterval();
  }

  ngOnDestroy(): void {
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
  }

}
