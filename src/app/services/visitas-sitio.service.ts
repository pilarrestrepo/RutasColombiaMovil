import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { configuracionServicio, httpOptions} from '../util/configuracion'

@Injectable({
  providedIn: 'root'
})
export class VisitasSitioService {

  constructor(private http: HttpClient,
    private router: Router) { }
    
    crearVisitaSitio(visita:any) {
      var body = JSON.stringify(visita);
      
      return this.http.post<any>(configuracionServicio.DominioServicio + 'crearVisitaSitio', body, httpOptions)
        .pipe(
          tap((respuesta: any) => {
            //Se valida que si existe un mensaje de error
            if (respuesta.error) {
              throw (respuesta.error);
            }
            return respuesta;
          }),
          catchError(this.handleError)
        );
    }   
    private handleError(error: HttpErrorResponse) {
      return throwError(error);
    };
}
