import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [FormsModule, TarjetaNoticia],
  selector: 'app-noticias',
  styleUrl: './noticias.css',
  templateUrl: './noticias.html',
})
export class Noticias {
  readonly noticiasPorPagina = 9;
  readonly servicioNoticias = inject(ServicioNoticias);
  readonly busqueda = signal('');
  readonly categoria = signal('Todas');
  readonly paginaActual = signal(1);
  readonly categorias = ['Todas', 'Tecnología', 'Educación', 'Innovación', 'Tendencias'];
  readonly noticiasFiltradas = computed(() => {
    const texto = this.normalizar(this.busqueda());
    return this.servicioNoticias.noticias().filter((noticia) =>
      (this.categoria() === 'Todas' || noticia.categoria === this.categoria()) &&
      this.normalizar(`${noticia.titulo} ${noticia.resumen} ${noticia.categoria} ${noticia.autor}`).includes(texto),
    );
  });
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.noticiasFiltradas().length / this.noticiasPorPagina)));
  readonly paginaValida = computed(() => Math.min(this.paginaActual(), this.totalPaginas()));
  readonly paginas = computed(() => this.calcularPaginasVisibles(this.paginaValida(), this.totalPaginas()));
  readonly noticiasPagina = computed(() => {
    const inicio = (this.paginaValida() - 1) * this.noticiasPorPagina;
    return this.noticiasFiltradas().slice(inicio, inicio + this.noticiasPorPagina);
  });

  actualizarBusqueda(texto: string): void {
    this.busqueda.set(texto);
    this.paginaActual.set(1);
  }

  cambiarCategoria(categoria: string): void {
    this.categoria.set(categoria);
    this.paginaActual.set(1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaActual.set(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  private calcularPaginasVisibles(actual: number, total: number): number[] {
    if (total <= 7) return Array.from({ length: total }, (_, indice) => indice + 1);
    return [...new Set([1, 2, actual - 1, actual, actual + 1, total - 1, total])]
      .filter((pagina) => pagina >= 1 && pagina <= total)
      .sort((a, b) => a - b);
  }
}