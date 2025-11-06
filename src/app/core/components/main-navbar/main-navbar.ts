import { Component } from '@angular/core';
import { RegisterNavbar } from '../register-navbar/register-navbar';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-main-navbar',
  imports: [RegisterNavbar, NgIf, NgFor],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css',
})
export class MainNavbar {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
