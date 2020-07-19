import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;
  public currentViles;
  public cinemas;
  public currentCinemas;
  public salles;
  public currentProjection;
  public selectedTickets: any;
  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes=data
      },error => {
        console.log(error)
      })
  }

  onGetCinemas(v) {
    this.currentViles=v
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data
      },error => {console.log(error)})
  }

  onGetSalle(c) {
    this.currentCinemas=c;
    this.cinemaService.getSalle(c)
      .subscribe(data=>{
        this.salles=data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections=data;
            },error => {console.log(error)})
        })
      },error => {console.log(error)})

  }

  onGetTicketPlace(p) {
    this.currentProjection=p;
    this.cinemaService.getTicketPlace(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[]
      })

  }

  getTicketClass(t){
    console.log(t.reserved)
    let c="btn ticket "
    if(t.reserved==true){
      c+="btn-danger"
    }
    else if(t.selected){
      c+="btn-warning"
    }
    else{
      c+="btn-success"

    }
    return c
  }
  onSelectTickets(t) {
  if(!t.selected){
    t.selected=true;
    this.selectedTickets.push(t);
  }
  else{
    t.selected=false;
    this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
  }
  console.log(this.selectedTickets)
  }

  onPayTicket(form) {
    console.log(form)
    let tickets=[]

    this.selectedTickets.forEach(t=>{
      tickets.push(t.id)
    })
    form.ticketsIds=tickets
    this.cinemaService.payerTicket(form)
      .subscribe((data)=>{
        alert("Payement passé avec succès");
        this.onGetTicketPlace(this.currentProjection)
      },error=>console.log(error))
  }
}
