import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Project } from '../model/project';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private API_URL = '/api/projects';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Project[]> {

    return this.http.get<Project[]>(`${this.API_URL}`)
    .pipe(catchError(this.errorHandler));

  }

  getById(id:string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`)
    .pipe(catchError(this.errorHandler));
  }

  deleteById(id:string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error. Please try again later.'));
  }

}
