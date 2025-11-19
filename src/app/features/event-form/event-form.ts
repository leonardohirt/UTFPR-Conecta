import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Api } from '../../core/services/api';
import { Button } from '../../shared/button/button';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
// ⚠️ REMOVER import { createClient } from '@supabase/supabase-js'; 
import { SupabaseService } from '../../../supabase.service';// Adicione a importação do Serviço


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

  // 🟡 Campos do formulário
  nome = '';
  descricao = '';
  data = '';
  horaInicio = '';
  horaFim = '';
  categoria = '';
  formato = '';
  tipoInscricao = '';
  limiteVagas: number | null = null;
  emiteCertificado = false;

  // 🟡 Endereço
  cep = '';
  endereco = {
    rua: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  // 🟡 Banner
  bannerFile: File | null = null;

  // 🟡 Modal
  showModal = false;
  modalType: 'success' | 'error' | null = null;
  modalMessage = '';
  isSubmitting = false; // Controle de estado para evitar cliques duplos

  // INJEÇÃO CORRIGIDA: Usa o SupabaseService
  constructor(
    private addressService: Api,
    private supabaseService: SupabaseService // ✅ Serviço Supabase injetado
  ) {}

  // ===============================
  // 🔵 BUSCAR ENDEREÇO POR CEP
  // ===============================
  buscarEndereco() {
    if (this.cep.length < 8) return;

    this.addressService.getAddressByCep(this.cep).subscribe({
      next: (dados) => {
        this.endereco = dados;
      },
      error: () => {
        this.openModal('error', 'CEP não encontrado.');
      }
    });
  }

  // ===============================
  // 🟣 PEGAR O ARQUIVO DO BANNER
  // ===============================
  onBannerSelected(event: any) {
    this.bannerFile = event.target.files[0];
  }

  // ===============================
  // 🟢 ENVIAR FORMULÁRIO COMPLETO
  // ===============================
  async enviarEvento() {
    if (!this.bannerFile) {
        this.openModal('error', 'Selecione um banner para o evento.');
        return;
    }
    
    this.isSubmitting = true;

    try {
      // 1. CHAMA O UPLOAD NO SERVIÇO
      const { url: bannerUrl, error: uploadError } = await this.supabaseService.uploadBanner(this.bannerFile);

      if (uploadError) {
          this.openModal('error', `Erro ao fazer upload do banner: ${uploadError.message}`);
          return;
      }
      
      // 2. PREPARA DADOS PARA O SERVIÇO (Passa todos os dados do formulário)
      const eventData = {
        nome: this.nome,
        descricao: this.descricao,
        data: this.data,
        horaInicio: this.horaInicio,
        horaFim: this.horaFim,
        categoria: this.categoria,
        formato: this.formato,
        tipoInscricao: this.tipoInscricao,
        limiteVagas: this.limiteVagas,
        emiteCertificado: this.emiteCertificado,
        cep: this.cep,
        endereco: this.endereco // Passa o objeto endereço completo
      };

      // 3. CHAMA A INSERÇÃO NO BD NO SERVIÇO
      const { error: dbError } = await this.supabaseService.insertEvent(eventData, bannerUrl || '');

      if (dbError) {
        this.openModal('error', `Erro ao enviar evento: ${dbError.message}`);
        return;
      }

      this.openModal('success', 'Evento enviado para aprovação.\n Aguarde até 24h!');
      // TODO: Adicionar lógica para limpar o formulário.

    } catch (e) {
        this.openModal('error', 'Ocorreu um erro inesperado.');
        console.error('Erro no envio do evento:', e);
    } finally {
        this.isSubmitting = false;
    }
  }

  // ===============================
  // 🟡 MODAL
  // ===============================
  openModal(type: 'success' | 'error', msg: string) {
    this.modalType = type;
    this.modalMessage = msg;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}