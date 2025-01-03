import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Translation } from '../model/translation';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  API_BASE_URL = '/api/projects';

  constructor(private http: HttpClient) { }

  create(projectId: string, resourceId: string, translation: Translation): Observable<Translation> {
    return this.http.post<Translation>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}/translation`, translation)
    .pipe(catchError(this.errorHandler));
  }

  getAll(projectId:string, resourceId: string): Observable<Translation[]> {

    return this.http.get<Translation[]>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}/translations`)
    .pipe(catchError(this.errorHandler));

  }

  update(projectId:string, resourceId: string, translation: Translation): Observable<Translation> {
    return this.http.put<Translation>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}/translations/${translation.locale}`, translation)
    .pipe(catchError(this.errorHandler));
  }

  deleteById(projectId:string, resourceId: string, locale: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}/translations/${locale}`)
    .pipe(catchError(this.errorHandler));
  }

  getById(projectId:string, resourceId: string, locale: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}/translations/${locale}`)
    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error. Please try again later.'));
  }
}
