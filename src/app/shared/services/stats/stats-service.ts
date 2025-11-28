import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMatch } from '../../types/imatch';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../token/token-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  endpoint = '/api/stats'

  constructor(private http: HttpClient, private tokenService: TokenService) {}

getStats(): Observable<{"stats": IMatch[], "wins": Number}> {
  const token = this.tokenService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(
    `${environment.SERVER_URL}${this.endpoint}`,
    { headers }
  ).pipe(
    map(res => { 
      console.log(res); 
      const response = {
        "stats": res.stats as IMatch[],
        "wins": res.wins || 0
       }
      return response
    })
  );
}

}
