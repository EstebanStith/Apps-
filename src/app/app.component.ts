import { Component, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  tareas = signal<string[]>([]);

  @ViewChild('inputTarea') inputElement!: ElementRef<HTMLInputElement>;

  agregarTarea(texto: string) {
    const tareaLimpia = texto.trim();
    if (!tareaLimpia) return;

    this.tareas.update(lista => [...lista, tareaLimpia]);

    this.inputElement.nativeElement.value = '';
    this.inputElement.nativeElement.focus();
  }
}
