import { Component, Input, Output, EventEmitter } from '@angular/core';

// CORREÇÃO: Adicione 'danger' à união de tipos ButtonColor
type ButtonColor = 'primary-yellow' | 'danger'; 
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {

  // O Input agora aceita 'danger'
  @Input() color: ButtonColor = 'primary-yellow';
  @Input() type: ButtonType = 'button';
  @Input() disabled: boolean = false;  

  @Input('class') externalClasses: string = '';

  @Output() buttonClick = new EventEmitter<MouseEvent>();

 

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }

  get computedClasses(): string {
    
    

    const baseClasses = [
      'inline-flex', 'items-center', 'justify-center', 'px-4', 'py-3',
      'font-semibold', 
      'rounded-md', 'shadow-sm', 'focus:outline-none', 'focus:ring-2', 
      'focus:ring-offset-2', 'transition-colors', 'duration-200',
      'disabled:opacity-50', 'disabled:cursor-not-allowed', 'focus:ring-yellow-400'
    ];
    
    // Mapeamento de cores (já inclui 'danger')
    const colorClasses: { [key in ButtonColor]: string } = {
      'primary-yellow': 'bg-yellow-400 text-white rounded-md shadow-sm hover:bg-yellow-500 ',
      'danger': 'bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 '
    };

   
return [
      ...baseClasses,
      colorClasses[this.color],
      this.externalClasses  
    ].join(' ');
  }
}