import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
  }

  get(path: string, httpParams: HttpParams = null, httpHeaders?: HttpHeaders): Observable<any> {
    const url = this.getRequestURL(path);
    const apiRequest = this.http.get(url, {headers: this.setHeaders(httpHeaders), params: httpParams});
    return apiRequest;
  }
  post(path: string, body: object = {}): Observable<any> {
    const url = this.getRequestURL(path);
    const apiRequest = this.http.post(url, body, {headers: this.setHeaders()});
    return apiRequest;
  }
  patch(path: string, body: object = {}): Observable<any> {
    const url = this.getRequestURL(path);
    const apiRequest = this.http.patch(url, body, {headers: this.setHeaders()});
    return apiRequest;
  }
  put(path: string, body: object = {}): Observable<any> {
    const url = this.getRequestURL(path);
    const apiRequest = this.http.put(url, body, {headers: this.setHeaders()});
    return apiRequest;
  }
  delete(path: string): Observable<any> {
    const url = this.getRequestURL(path);
    const apiRequest = this.http.delete(url, {headers: this.setHeaders()});
    return apiRequest;
  }

  private getRequestURL(path: string) {
    let url = '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = path;
    } else {
      url = this.baseURL + path;
    }
    return url;
  }

  private setHeaders(header?: HttpHeaders): HttpHeaders {
    if (!header) {
      header = new HttpHeaders();
    }
    header.append('Content-Type', 'application/json');
    return header;
  }
}
