import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  API_URL = '/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}`)
    .pipe(catchError(this.errorHandler));
  }

  getProjectById(id:string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}`)
    .pipe(catchError(this.errorHandler));
  }

  deleteProjectById(id:string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}`)
    .pipe(catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error. Please try again later.'));
  }

}
