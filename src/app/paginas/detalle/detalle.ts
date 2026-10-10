import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle',
  styleUrl: './detalle.css',
  templateUrl: './detalle.html',
})
export class Detalle {
  readonly servicioNoticias = inject(ServicioNoticias);
  private readonly ruta = inject(ActivatedRoute);
  readonly id = signal(Number(this.ruta.snapshot.paramMap.get('id')));
  readonly textoCompartir = signal('Compartir');
  readonly noticia = computed(() => this.servicioNoticias.buscarPorId(this.id()));
  readonly relacionadas = computed(() => {
    const actual = this.noticia();
    if (!actual) return [];
    return this.servicioNoticias.noticias().filter((item) => item.id !== actual.id)
      .sort((a, b) => Number(b.categoria === actual.categoria) - Number(a.categoria === actual.categoria)).slice(0, 3);
  });

  constructor() {
    this.ruta.paramMap.subscribe((parametros) => this.id.set(Number(parametros.get('id'))));
  }

  minutosLectura(contenido: string): number {
    return Math.max(1, Math.ceil(contenido.trim().split(/\s+/).length / 200));
  }

  async compartir(): Promise<void> {
    try {
      if (navigator.share) {
        await navigator.share({ title: this.noticia()?.titulo, url: location.href });
      } else {
        await navigator.clipboard.writeText(location.href);
        this.textoCompartir.set('Enlace copiado');
        window.setTimeout(() => this.textoCompartir.set('Compartir'), 2500);
      }
    } catch {
      // Cerrar el menú de compartir no debe mostrar un error en la aplicación.
    }
  }
}