import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {

  selectedRole: string = 'VIEWER'; // default 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Recupera il ruolo salvato al refresh
    const savedRole = this.authService.getRuolo();
    this.selectedRole = savedRole;
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.authService.setRuolo(role); // aggiorna anche l'AuthService
    console.log('Ruolo selezionato:', role);
  }
}
