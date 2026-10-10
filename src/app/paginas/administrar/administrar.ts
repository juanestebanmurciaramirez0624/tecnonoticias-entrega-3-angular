import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../modelos/noticia';
import { ServicioNoticias } from '../../servicios/noticias';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-administrar',
  styleUrl: './administrar.css',
  templateUrl: './administrar.html',
})
export class Administrar {
  private readonly tiposImagen = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly pesoMaximoImagen = 5 * 1024 * 1024;
  private readonly anchoMaximoImagen = 1000;

  readonly servicioNoticias = inject(ServicioNoticias);
  readonly creadas = signal<Noticia[]>(this.leerCreadas());
  readonly formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5), Validators.maxLength(120)] }),
    autor: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60), Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/)] }),
    categoria: new FormControl('Tecnología', { nonNullable: true, validators: [Validators.required] }),
    resumen: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20), Validators.maxLength(300)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(50), Validators.maxLength(3000)] }),
    destacada: new FormControl(false, { nonNullable: true }),
  });

  editando: Noticia | null = null;
  imagen = '';
  errorImagen = '';
  mensaje = '';
  mensajeCorrecto = false;
  procesandoImagen = false;

  mostrarError(campo: keyof Administrar['formulario']['controls']): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  async seleccionarImagen(evento: Event): Promise<void> {
    const campo = evento.target as HTMLInputElement;
    const archivo = campo.files?.[0];
    this.errorImagen = '';
    if (!archivo) return;

    if (!this.tiposImagen.includes(archivo.type)) {
      this.errorImagen = 'Formato no permitido. Usa JPG, PNG o WEBP.';
      campo.value = '';
      return;
    }
    if (archivo.size > this.pesoMaximoImagen) {
      this.errorImagen = 'La imagen supera el máximo permitido de 5 MB.';
      campo.value = '';
      return;
    }

    this.procesandoImagen = true;
    try {
      this.imagen = await this.comprimirImagen(archivo);
    } catch {
      this.errorImagen = 'No se pudo procesar la imagen. Selecciona otro archivo.';
      campo.value = '';
    } finally {
      this.procesandoImagen = false;
    }
  }

  guardar(): void {
    this.mensaje = '';
    if (this.formulario.invalid || !this.imagen) {
      this.formulario.markAllAsTouched();
      if (!this.imagen) this.errorImagen = 'Selecciona una imagen para la noticia.';
      this.mensajeCorrecto = false;
      this.mensaje = 'Revisa los campos marcados antes de guardar.';
      return;
    }

    const valor = this.formulario.getRawValue();
    const noticia: Noticia = {
      ...valor,
      id: this.editando?.id ?? Date.now(),
      fecha: this.editando?.fecha ?? this.fechaLocal(),
      imagen: this.imagen,
    };
    const lista = this.editando
      ? this.creadas().map((item) => item.id === noticia.id ? noticia : item)
      : [noticia, ...this.creadas()];

    if (!this.persistir(lista)) return;
    const accion = this.editando ? 'actualizada' : 'creada';
    this.limpiarFormulario();
    this.mensajeCorrecto = true;
    this.mensaje = `Noticia ${accion} correctamente.`;
    this.servicioNoticias.cargarNoticias();
  }

  editar(noticia: Noticia): void {
    this.editando = noticia;
    this.imagen = noticia.imagen;
    this.errorImagen = '';
    this.mensaje = '';
    this.formulario.setValue({
      titulo: noticia.titulo,
      autor: noticia.autor,
      categoria: noticia.categoria,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
      destacada: noticia.destacada,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(noticia: Noticia): void {
    const confirmado = window.confirm(`¿Seguro que deseas eliminar “${noticia.titulo}”? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    if (!this.persistir(this.creadas().filter((item) => item.id !== noticia.id))) return;
    const favoritos = this.servicioNoticias.favoritos().filter((id) => id !== noticia.id);
    this.servicioNoticias.favoritos.set(favoritos);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    if (this.editando?.id === noticia.id) this.limpiarFormulario();
    this.mensajeCorrecto = true;
    this.mensaje = 'Noticia eliminada correctamente.';
    this.servicioNoticias.cargarNoticias();
  }

  cancelar(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  private limpiarFormulario(): void {
    this.editando = null;
    this.imagen = '';
    this.errorImagen = '';
    this.formulario.reset({ categoria: 'Tecnología', destacada: false });
  }

  private persistir(lista: Noticia[]): boolean {
    try {
      localStorage.setItem('noticiasCreadas', JSON.stringify(lista));
      this.creadas.set(lista);
      return true;
    } catch {
      this.mensajeCorrecto = false;
      this.mensaje = 'No hay espacio suficiente en el navegador. Elimina alguna noticia e inténtalo nuevamente.';
      return false;
    }
  }

  private leerCreadas(): Noticia[] {
    try {
      return JSON.parse(localStorage.getItem('noticiasCreadas') ?? '[]') as Noticia[];
    } catch {
      return [];
    }
  }

  private fechaLocal(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  private comprimirImagen(archivo: File): Promise<string> {
    return new Promise((resolver, rechazar) => {
      const direccion = URL.createObjectURL(archivo);
      const imagen = new Image();
      imagen.onload = () => {
        const escala = Math.min(1, this.anchoMaximoImagen / imagen.width);
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(imagen.width * escala);
        lienzo.height = Math.round(imagen.height * escala);
        const contexto = lienzo.getContext('2d');
        if (!contexto) return rechazar(new Error('Canvas no disponible'));
        contexto.fillStyle = '#ffffff';
        contexto.fillRect(0, 0, lienzo.width, lienzo.height);
        contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        URL.revokeObjectURL(direccion);
        resolver(lienzo.toDataURL('image/jpeg', 0.75));
      };
      imagen.onerror = () => {
        URL.revokeObjectURL(direccion);
        rechazar(new Error('Imagen no válida'));
      };
      imagen.src = direccion;
    });
  }
}