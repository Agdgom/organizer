import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Task } from 'src/app/models/app.model';
import { DateService } from 'src/app/services/date.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  selectedDate$: BehaviorSubject<moment.Moment> | undefined;
  tasks: Task[] | undefined;
  organizerForm: FormGroup | undefined;

  constructor(
    private dateService: DateService,
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    this.selectedDate$ = this.dateService.date;

    this.dateService.date
      .pipe(switchMap((value) => this.tasksService.loadTasks(value)))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });

    this.organizerForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  addTask() {
    const { title } = this.organizerForm?.value;
    const task: Task = {
      title,
      date: this.selectedDate$?.value.format('DD-MM-YYYY'),
    };
    this.tasksService.createTask(task).subscribe(() => {
      this.loadTasks();
      this.organizerForm?.reset();
    });
  }

  loadTasks() {
    if (this.selectedDate$?.value) {
      this.tasksService
        .loadTasks(this.selectedDate$?.value)
        .subscribe((tasks) => (this.tasks = tasks));
    }
  }

  removeTask(task: Task) {
    this.tasksService.removeTask(task).subscribe(() => {
      this.loadTasks();
    });
  }
}
