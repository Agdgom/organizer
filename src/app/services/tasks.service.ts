import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as moment from 'moment';
import { CreateResponse, Task } from '../models/app.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  static url =
    'https://angular-organizer-dc128-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/tasks/${task.date}.json`, task)
      .pipe(
        map((res) => {
          return { ...task, id: res.name };
        })
      );
  }
  loadTasks(date: moment.Moment) {
    return this.http
      .get<Task[]>(
        `${TasksService.url}/tasks/${date.format('DD-MM-YYYY')}.json`
      )
      .pipe(
        map((tasks) => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map((key) => {
            return { ...tasks[key as any], id: key };
          });
        })
      );
  }

  removeTask(task: Task): Observable<void> {
    return this.http.delete<void>(
      `${TasksService.url}/tasks/${task.date}/${task.id}.json`
    );
  }
}
