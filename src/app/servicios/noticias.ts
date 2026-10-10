import { Injectable, computed, signal } from '@angular/core';
import { Noticia } from '../modelos/noticia';

@Injectable({ providedIn: 'root' })
export class ServicioNoticias {
  readonly noticias = signal<Noticia[]>([]);
  readonly favoritos = signal<number[]>(this.leer<number[]>('favoritos', []));
  readonly noticiasFavoritas = computed(() =>
    this.noticias().filter((noticia) => this.favoritos().includes(noticia.id)),
  );

  constructor() {
    this.cargarNoticias();
  }

  async cargarNoticias(): Promise<void> {
    const creadas = this.leer<Noticia[]>('noticiasCreadas', []);
    try {
      const direccionDatos = new URL('data/noticias.json', document.baseURI);
      const respuesta = await fetch(direccionDatos);
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
      const noticiasBase = (await respuesta.json()) as Noticia[];
      this.noticias.set([...creadas, ...noticiasBase].sort((a, b) => b.fecha.localeCompare(a.fecha)));
    } catch {
      // Las noticias creadas siguen disponibles aunque falle el archivo de datos inicial.
      this.noticias.set(creadas);
    }
  }

  buscarPorId(id: number): Noticia | undefined {
    return this.noticias().find((noticia) => noticia.id === id);
  }

  esFavorita(id: number): boolean {
    return this.favoritos().includes(id);
  }

  alternarFavorito(id: number): void {
    const favoritos = this.esFavorita(id)
      ? this.favoritos().filter((favorito) => favorito !== id)
      : [...this.favoritos(), id];
    this.favoritos.set(favoritos);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  private leer<T>(clave: string, valorInicial: T): T {
    try {
      return JSON.parse(localStorage.getItem(clave) ?? '') as T;
    } catch {
      return valorInicial;
    }
  }
}
