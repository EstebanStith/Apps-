import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  
  pokemonList: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.pokemonService.getPokemonList(20, 0).subscribe({
      next: (response) => {
        // En lugar de guardar los resultados crudos, vamos a procesarlos un poco
        this.pokemonList = response.results.map((pokemon: any) => {
          // La URL viene así: "https://pokeapi.co/api/v2/pokemon/1/"
          // Cortamos la URL por los "/" y sacamos el ID que está casi al final
          const urlParts = pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          
          return {
            name: pokemon.name,
            id: id,
            // Esta es la URL oficial directa a las imágenes de alta calidad
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar', err);
        this.isLoading = false;
      }
    });
  }
}
