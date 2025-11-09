import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Api } from '../../core/services/api';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/button/button';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
    Button,
    MainNavbar
  ],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css']
})
export class EventForm {

  cep = '';
  endereco = {
    rua: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  constructor(private addressService: Api) {}

  buscarEndereco() {
    if (this.cep.length < 8) return;

    this.addressService.getAddressByCep(this.cep).subscribe({
      next: (dados) => {
        this.endereco = dados;
      },
      error: () => {
        alert('CEP não encontrado!');
      }
    });
  }
}