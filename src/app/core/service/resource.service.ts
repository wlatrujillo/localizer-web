import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Resource } from '../model/resource';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  API_BASE_URL = '/api/projects';

  constructor(private http: HttpClient) { }

  create(projectId: string, resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(`${this.API_BASE_URL}/${projectId}/resources`, resource)
    .pipe(catchError(this.errorHandler));
  }

  getAll(projectId:string): Observable<Resource[]> {

    return this.http.get<Resource[]>(`${this.API_BASE_URL}/${projectId}/resources`)
    .pipe(catchError(this.errorHandler));

  }

  getFilterByText(projectId:string): Observable<Resource[]> {

    return this.http.get<Resource[]>(`${this.API_BASE_URL}/${projectId}/resources`)
    .pipe(catchError(this.errorHandler));

  }

  update(projectId:string, resource: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.API_BASE_URL}/${projectId}/resources/${resource.code}`, resource)
    .pipe(catchError(this.errorHandler));
  }

  deleteById(projectId:string, resourceId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}`)
    .pipe(catchError(this.errorHandler));
  }

  getById(projectId:string, resourceId: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.API_BASE_URL}/${projectId}/resources/${resourceId}`)
    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error. Please try again later.'));
  }
}
