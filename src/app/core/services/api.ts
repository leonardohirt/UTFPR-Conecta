// src/app/core/services/address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  /** Busca endereço a partir do CEP digitado */
  getAddressByCep(cep: string): Observable<any> {
    // remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get(`${this.viaCepUrl}/${cleanCep}/json/`).pipe(
      map((data: any) => {
        if (data.erro) throw new Error('CEP não encontrado');
        return {
          cep: data.cep,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        };
      })
    );
  }
}
