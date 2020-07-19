import { Component } from '@angular/core';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazyloading.component.html',
  styleUrls: ['./lazyloading.component.scss']
})
export class LazyLoadingComponent {
  dots = [1, 2, 3];
}
