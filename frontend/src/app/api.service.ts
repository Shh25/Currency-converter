import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  private baseUrl = environment.baseUrl;

  getCurrencies (): Observable<any> {
		let currencyUrl = `${this.baseUrl}/currencies`;
		return this.http.get(currencyUrl)
			.pipe(map(response => {
        return response
      }),
			catchError(error => {
      console.log('Err: ', error)
      return of(error.message)
    }))
  }
  getConversionLogs (queryParams): Observable<any> {
		let conversionLogUrl = `${this.baseUrl}/conversionLogs`;
		return this.http.get(conversionLogUrl, {params: queryParams})
			.pipe(map(response => {
        return response
      }),
			catchError(error => {
      console.log('Err: ', error)
      return of(error.message)
    }))
  }
  
  postConversionLog (converionBody): Observable<any> {
		let conversionUrl = `${this.baseUrl}/uploads`;
		return this.http.post(conversionUrl, converionBody, { headers: httpHeaders, observe: 'response' })
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      console.log('Error in logs: ', error)
      return of(error.message)
    }))
	}
}
