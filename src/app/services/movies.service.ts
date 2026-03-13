import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {

  private LS_KEY = 'mis_peliculas';

  getCategories(): { name: string; movies: Movie[] }[] {
    return [
      {
        name: '🔥 Acción',
        movies: [
          { id: 1, title: 'Mad Max: Furia', category: 'Acción', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop', description: 'En un mundo postapocalíptico, Furiosa huye de un tirano.' },
          { id: 2, title: 'John Wick', category: 'Acción', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop', description: 'Un exasesino sale del retiro para vengar la muerte de su perro.' },
          { id: 3, title: 'Top Gun: Maverick', category: 'Acción', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop', description: 'Maverick regresa a entrenar una nueva generación de pilotos.' },
          { id: 4, title: 'The Dark Knight', category: 'Acción', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop', description: 'Batman enfrenta al Joker en Gotham City.' },
          { id: 5, title: 'Mission Impossible', category: 'Acción', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop', description: 'Ethan Hunt debe detener una amenaza nuclear global.' },
        ]
      },
      {
        name: '😂 Comedia',
        movies: [
          { id: 6, title: 'Grand Budapest', category: 'Comedia', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&h=750&fit=crop', description: 'Las aventuras de un excéntrico conserje de hotel.' },
          { id: 7, title: 'Superbad', category: 'Comedia', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&h=750&fit=crop', description: 'Dos amigos intentan conseguir alcohol para una fiesta.' },
          { id: 8, title: 'The Mask', category: 'Comedia', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&h=750&fit=crop', description: 'Un hombre encuentra una máscara mágica caótica.' },
          { id: 9, title: 'Liar Liar', category: 'Comedia', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&h=750&fit=crop', description: 'Un abogado es maldecido a decir solo la verdad.' },
          { id: 10, title: 'Home Alone', category: 'Comedia', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&h=750&fit=crop', description: 'Un niño defiende su casa de dos ladrones en Navidad.' },
        ]
      },
      {
        name: '👻 Terror',
        movies: [
          { id: 11, title: 'It', category: 'Terror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&h=750&fit=crop', description: 'Un grupo de niños enfrenta a Pennywise, un payaso aterrador.' },
          { id: 12, title: 'The Conjuring', category: 'Terror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&h=750&fit=crop', description: 'Investigadores paranormales ayudan a una familia.' },
          { id: 13, title: 'Get Out', category: 'Terror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&h=750&fit=crop', description: 'Un joven descubre una oscura conspiración en casa de su novia.' },
          { id: 14, title: 'A Quiet Place', category: 'Terror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&h=750&fit=crop', description: 'Una familia sobrevive en silencio para evitar a los monstruos.' },
          { id: 15, title: 'Hereditary', category: 'Terror', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&h=750&fit=crop', description: 'Una familia descubre secretos oscuros tras una muerte.' },
        ]
      }
    ];
  }

  saveMovie(movie: Movie): void {
    const saved = this.getSavedMovies();
    if (!saved.find(m => m.id === movie.id)) {
      saved.push(movie);
      localStorage.setItem(this.LS_KEY, JSON.stringify(saved));
    }
  }

  getSavedMovies(): Movie[] {
    const data = localStorage.getItem(this.LS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getMovieById(id: number): Movie | undefined {
    return this.getCategories()
      .flatMap(c => c.movies)
      .find(m => m.id === id);
  }
}
