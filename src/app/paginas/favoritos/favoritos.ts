import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [RouterLink, TarjetaNoticia],
  selector: 'app-favoritos',
  styleUrl: './favoritos.css',
  templateUrl: './favoritos.html',
})
export class Favoritos {
  readonly noticiasPorPagina = 9;
  readonly servicioNoticias = inject(ServicioNoticias);
  readonly paginaActual = signal(1);
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.servicioNoticias.noticiasFavoritas().length / this.noticiasPorPagina)));
  readonly paginaValida = computed(() => Math.min(this.paginaActual(), this.totalPaginas()));
  readonly paginas = computed(() => this.calcularPaginasVisibles(this.paginaValida(), this.totalPaginas()));
  readonly favoritosPagina = computed(() => {
    const inicio = (this.paginaValida() - 1) * this.noticiasPorPagina;
    return this.servicioNoticias.noticiasFavoritas().slice(inicio, inicio + this.noticiasPorPagina);
  });

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaActual.set(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private calcularPaginasVisibles(actual: number, total: number): number[] {
    if (total <= 7) return Array.from({ length: total }, (_, indice) => indice + 1);
    return [...new Set([1, 2, actual - 1, actual, actual + 1, total - 1, total])]
      .filter((pagina) => pagina >= 1 && pagina <= total)
      .sort((a, b) => a - b);
  }
}