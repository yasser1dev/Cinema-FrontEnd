import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public host="http://localhost:8080"
  constructor(private http: HttpClient) { }
  public getVilles(){
    return this.http.get(this.host+"/villes")
  }

  getCinemas(v) {
    return this.http.get(v._links.cinemas.href)
  }

  getSalle(c) {
    return this.http.get(c._links.salles.href)
  }

  getProjections(salle) {
    let url=salle._links.projections.href.replace("{?projection}","?projection=p1")
    //console.log(url)
    return this.http.get(url)
  }

  getTicketPlace(p) {
  let url=p._links.tickets.href.replace("{?projection}","?projection=t")
    return this.http.get(url)
  }

  payerTicket(form) {
    return this.http.post(this.host+"/payerTicket",form)
  }
}
