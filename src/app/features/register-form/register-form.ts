import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  name: string = '';
  selectType: string = 'ra';
  ra: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';

  register(): void {
    if (this.password !== this.passwordConfirm || this.password === '') {
      alert('As senhas não coincidem ou estão vazias.');
      return;
    }

    const idValue =
      this.selectType === 'ra'
        ? `RA: ${this.ra}`
        : `Email: ${this.email}`;

    alert(
      `Cadastro realizado com sucesso!\nNome: ${this.name}\n${idValue}`
    );
  }
}
