import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, finalize } from 'rxjs/operators';

import { Provider, ProvidersResponse } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    console.log('auth service started');
  }

  getProviders(host): Observable<Provider[]> {
    // localStorage.removeItem(environment.storage.token);
    const options = {
      /*headers:new HttpHeaders ({
        "Content-Type": "application/json"
      }),*/
      params: {p: 'providers'},
      withCredentials: true
    };
    return this.http.get<ProvidersResponse>(`${host}/contacts`, options)
      .pipe(map((response: ProvidersResponse) => {
          /*
          const p = res.data.find(provider => provider.active);
          if (p) {
            localStorage.setItem(environment.storage.token, 'authenticated');
          }
          console.log(response);
          */
          return response.data;
      }), catchError((error: HttpErrorResponse) => {
          console.log(error);
          //this.notificationService.showErrorMessage(error.message);
          return throwError('Something went wrong');      
      }), finalize(() => {
      }));
  }

}
