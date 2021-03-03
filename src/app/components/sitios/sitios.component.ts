import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitios',
  templateUrl: './sitios.component.html',
  styleUrls: ['./sitios.component.css']
})
export class SitiosComponent implements OnInit {

  constructor() { }
  lat = 51.678418;
  lng = 7.809007;
  ngOnInit(): void {
  }

}
