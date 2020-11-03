import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';


@Component({
  selector: 'app-food--panel',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  constructor(private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.navigationService.changeNavSubject(5);
  }

  ngOnDestroy(): void {
  }
}
