import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  // Inyectamos el servicio y el lector de rutas de Angular
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);

  pokemon: any = null;
  isLoading = true;

  ngOnInit(): void {
    // Leemos el parámetro 'name' de la URL de forma reactiva
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name');
      
      if (pokemonName) {
        this.getPokemonDetails(pokemonName);
      }
    });
  }

  getPokemonDetails(name: string): void {
    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalles', err);
        this.isLoading = false;
      }
    });
  }
}
