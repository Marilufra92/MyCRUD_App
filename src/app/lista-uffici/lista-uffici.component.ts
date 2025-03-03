import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-lista-uffici',
  standalone: false,
  templateUrl: './lista-uffici.component.html',
  styleUrls: ['./lista-uffici.component.css']
})
export class ListaUfficiComponent implements OnInit {
  displayedColumns: string[] = ['codUff', 'nomeUff', 'sede', 'indirizzo', 'numDipendenti', 'action' ];
  dataSource: any[] = [];

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUffici();
  }

  getUffici() {
    this.http.get<any>('http://localhost:3000/ufficio').subscribe(
      (response) => {
        this.dataSource = response.data;
      },
      (error) => {
        console.error('Errore nel recupero degli uffici:', error);
      }
    );
  }
}
