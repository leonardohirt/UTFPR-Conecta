import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
export class EventForm implements OnInit {

  eventId: string | null = null;
  currentUserId: string | null = null; 

  nome: string = '';
  descricao: string = '';
  data: string = '';
  horaInicio: string = '';
  horaFim: string = '';
  categoria: string = '';
  formato: string = '';
  tipoInscricao: string = '';
  limiteVagas: number | null = null;
  emiteCertificado: string = 'false';

  cep: string = '';
  endereco: any = {
    rua: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  bannerFile: File | null = null;
  isSubmitting = false;

  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private addressService: Api,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    this.currentUserId = user?.id ?? null;

    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'] ?? null;
      if (this.eventId) {
        this.carregarEvento(this.eventId);
      }
    });
  }

  async carregarEvento(id: string) {
    if (!this.currentUserId) {
      this.openModal('error', 'Você precisa estar logado para editar eventos.');
      this.router.navigate(['/event-crud']);
      return;
    }
    
    const { data, error } = await this.supabaseService.getEventById(id);
    if (error || !data) {
      console.error('Erro ao carregar evento', error);
      this.openModal('error', 'Evento não encontrado.');
      this.router.navigate(['/event-crud']);
      return;
    }

    // Verificar se o usuário logado é o criador
    if (data.criado_por !== this.currentUserId) {
      this.openModal('error', 'Você só pode editar eventos que criou.');
      this.router.navigate(['/event-crud']);
      return;
    }

    // Lógica de preenchimento do formulário
    const eventDate = new Date(data.data);
    const formattedDate = eventDate.toISOString().substring(0, 10);
    
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.data = formattedDate;
    this.horaInicio = data.hora_inicio ?? data.horaInicio;
    this.horaFim = data.hora_fim ?? data.horaFim;
    this.categoria = data.categoria;
    this.formato = data.formato;
    this.tipoInscricao = data.tipo_inscricao ?? data.tipoInscricao;
    this.limiteVagas = data.limite_vagas === null ? null : Number(data.limite_vagas);
    this.emiteCertificado = String(data.emite_certificado ?? data.emiteCertificado);

    this.cep = data.cep;
    this.endereco = {
      rua: data.rua ?? '',
      bairro: data.bairro ?? '',
      cidade: data.localidade ?? '',
      estado: data.uf ?? ''
    };
  }

  // RESTAURADO: Lógica de envio (criação) ou atualização
  async enviarEvento() {
    this.isSubmitting = true;

    try {
      if (this.eventId) {
        await this.atualizarEvento();
        return;
      }

      if (!this.bannerFile) {
        this.openModal('error', 'Selecione um banner para o evento.');
        this.isSubmitting = false;
        return;
      }

      const { url, error: uploadError } = await this.supabaseService.uploadBanner(this.bannerFile);
      if (uploadError || !url) {
        this.openModal('error', uploadError?.message || 'Erro ao enviar banner.');
        this.isSubmitting = false;
        return;
      }

      const { error } = await this.supabaseService.insertEvent(
        {
          nome: this.nome,
          descricao: this.descricao,
          data: this.data,
          horaInicio: this.horaInicio,
          horaFim: this.horaFim,
          categoria: this.categoria,
          formato: this.formato,
          tipoInscricao: this.tipoInscricao,
          limiteVagas: this.limiteVagas,
          emiteCertificado: this.emiteCertificado === 'true',
          cep: this.cep,
          endereco: this.endereco,
        },
        url
      );

      if (error) {
        this.openModal('error', error.message);
        return;
      }

      this.openModal('success', 'Evento criado com sucesso!');
      this.resetForm();

    } finally {
      this.isSubmitting = false;
    }
  }

  // RESTAURADO: Lógica de atualização
  async atualizarEvento() {
    const payload = {
      nome: this.nome,
      descricao: this.descricao,
      data: this.data,
      hora_inicio: this.horaInicio,
      hora_fim: this.horaFim,
      categoria: this.categoria,
      formato: this.formato,
      tipo_inscricao: this.tipoInscricao,
      limite_vagas: this.limiteVagas,
      emite_certificado: this.emiteCertificado === 'true',
      cep: this.cep,
      rua: this.endereco.rua,
      bairro: this.endereco.bairro,
      cidade: this.endereco.cidade,
      estado: this.endereco.estado,
    };

    const { error } = await this.supabaseService.updateEventById(this.eventId!, payload);

    if (error) {
      this.openModal('error', 'Erro ao atualizar evento: ' + error.message);
      return;
    }

    this.openModal('success', 'Evento atualizado com sucesso!');
  }


  onBannerSelected(event: any) {
    this.bannerFile = event.target.files[0] ?? null;
  }

get isFormValid(): boolean {
    return (
      this.nome.trim() !== '' &&
      this.descricao.trim() !== '' &&
      this.data.trim() !== '' &&
      this.horaInicio.trim() !== '' &&
      this.horaFim.trim() !== '' &&
      this.formato.trim() !== '' &&
      this.categoria.trim() !== '' &&
      this.tipoInscricao.trim() !== '' &&
      this.cep.trim() !== '' &&
      this.endereco.rua.trim() !== '' &&
      this.endereco.bairro.trim() !== '' &&
      this.endereco.cidade.trim() !== '' &&
      this.endereco.estado.trim() !== '' &&
      (this.eventId ? true : this.bannerFile !== null) // banner é obrigatório só na criação
    );
  }
  

  resetForm() {
    this.nome = '';
    this.descricao = '';
    this.data = '';
    this.horaInicio = '';
    this.horaFim = '';
    this.categoria = '';
    this.formato = '';
    this.tipoInscricao = '';
    this.limiteVagas = null;
    this.emiteCertificado = 'false';

    this.cep = '';
    this.endereco = { rua: '', bairro: '', cidade: '', estado: '' };

    this.bannerFile = null;
  }

  openModal(type: 'success' | 'error', message: string) {
    this.modalType = type;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async buscarEndereco() {
    if (!this.cep) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.openModal('error', 'CEP não encontrado.');
        return;
      }

      this.endereco.rua = data.logradouro ?? '';
      this.endereco.bairro = data.bairro ?? '';
      this.endereco.cidade = data.localidade ?? '';
      this.endereco.estado = data.uf ?? '';

    } catch (error) {
      this.openModal('error', 'Erro ao buscar o endereço.');
      console.error(error);
    }
  }
}