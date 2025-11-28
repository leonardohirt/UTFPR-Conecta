import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, ValueChangeEvent } from '@angular/forms';
import { Api } from '../../core/services/api';
import { Button } from '../../shared/button/button';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { SupabaseService } from '../../../supabase.service';
import { Footer } from "../../core/components/footer/footer";

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Button,
    MainNavbar,
    Footer
  ],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css']
})
export class EventForm {

  // Campos do formulário
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
  curso_destinado = [''];

  // Endereço
  cep = '';
  endereco = { rua: '', bairro: '', cidade: '', estado: '' };

  // Banner
  bannerFile: File | null = null;

  // Modal
  showModal = false;
  modalType: 'success' | 'error' | null = null;
  modalMessage = '';
  isSubmitting = false;

  constructor(
    private addressService: Api,
    private supabaseService: SupabaseService
  ) {}

  // Buscar endereço por CEP
  buscarEndereco() {
    if (this.cep.length < 8) return;

    this.addressService.getAddressByCep(this.cep).subscribe({
      next: (dados) => { this.endereco = dados; },
      error: () => { this.openModal('error', 'CEP não encontrado.'); }
    });
  }

  // Seleção do arquivo do banner
  onBannerSelected(event: any) {
    this.bannerFile = event.target.files[0];
  }

  // Enviar evento
  async enviarEvento() {
    if (!this.bannerFile) {
      this.openModal('error', 'Selecione um banner para o evento.');
      return;
    }

    this.isSubmitting = true;

    try {
      // Upload do banner
      const { url: bannerUrl, error: uploadError } = await this.supabaseService.uploadBanner(this.bannerFile);
      if (uploadError || !bannerUrl) {
        this.openModal('error', `Erro ao enviar banner: ${uploadError?.message || 'Desconhecido'}`);
        return;
      }

      // Preparar dados do evento
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
        endereco: this.endereco,
        curso_destinado: this.categoria,
      };

      // Inserir evento no Supabase
      const { error: dbError } = await this.supabaseService.insertEvent(eventData, bannerUrl);
      if (dbError) {
        this.openModal('error', `Erro ao enviar evento: ${dbError.message}`);
        return;
      }

      this.openModal('success', 'Evento enviado para aprovação.\nAguarde até 24h!');
      this.resetForm();

    } catch (e) {
      console.error('Erro no envio do evento:', e);
      this.openModal('error', 'Ocorreu um erro inesperado.');
    } finally {
      this.isSubmitting = false;
    }
  }

  // Modal
  openModal(type: 'success' | 'error', msg: string) {
    this.modalType = type;
    this.modalMessage = msg;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Resetar formulário após envio
  resetForm() {
    this.nome = '';
    this.descricao = '';
    this.data = '';
    this.horaInicio = '';
    this.horaFim = '';
    this.formato = '';
    this.cep = '';
    this.endereco = { rua: '', bairro: '', cidade: '', estado: '' };
    this.categoria = '';
    this.tipoInscricao = '';
    this.limiteVagas = null;
    this.emiteCertificado = false;
    this.bannerFile = null;
  }
}
