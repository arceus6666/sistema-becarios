import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { ISemestre } from '../interfaces/semestre.interface';

@Component({
  selector: 'app-semestres',
  templateUrl: './semestres.component.html',
  styleUrls: ['./semestres.component.scss']
})
export class SemestresComponent implements OnInit {

  public semestres: ISemestre[] = [];

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.service.getSemestres().then((s: any) => {
      this.semestres = s;
    });
  }

  public addSemestre() {
    Swal.fire({
      title: 'Nueva Gestión',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      preConfirm: (val: string) => {
        if (val.length > 0) return val;
        Swal.showValidationMessage('Debe llenar el nombre')
      }
    }).then((result: any) => {
      if (result.value) {
        this.service.createSemestre({ name: result.value }).then((r: any) => {
          this.semestres.push(r);
          Swal.fire('Created', '', 'success');
        }).catch(() => {
          Swal.fire('Error', 'Please try again later', 'error');
        });
      }
    });
  }

  public async editar(id) {
    const i = await this.semestres.findIndex(ss => ss._id === id);
    const s = this.semestres[i];
    await Swal.fire({
      title: 'Nuevo nombre?',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      preConfirm: (val: string) => {
        if (val.length > 0 && val !== s.name) return val;
        Swal.showValidationMessage('El nombre debe ser diferente y no puede estar vacío')
      }
    }).then(async (result: any) => {
      if (result.value) {
        s.name = await result.value
        await this.service.modifySemestre(s).then((r: any) => {
          this.semestres[i] = r;
          Swal.fire('Modificado', '', 'success');
        }).catch(() => {
          Swal.fire('Error', 'Please try again later', 'error');
        });
      }
    });
  }

  public async remove(id) {
    const i = await this.semestres.findIndex(ss => ss._id === id);
    Swal.fire({
      title: 'Eliminar?',
      text: 'Se eliminará a todos los becarios y las tareas asignadas a este semestre',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result: any) => {
      if (result.value) {
        this.service.deleteSemestre(id).then(r => {
          this.semestres.splice(i, 1);
          Swal.fire('Eliminado', '', 'success');
        })
      }
    })
  }

}
