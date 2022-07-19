import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {
  currentDate$: BehaviorSubject<moment.Moment> | undefined;
  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.currentDate$ = this.dateService.date;
  }

  changeMonth(dir: number = 0) {
    this.dateService.changeMonth(dir);
  }
}
