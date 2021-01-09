import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { IBecario } from '../interfaces/becario.interface';
import { ITarea } from '../interfaces/tarea.interface';

@Component({
  selector: 'app-becarios',
  templateUrl: './becarios.component.html',
  styleUrls: ['./becarios.component.scss']
})
export class BecariosComponent implements OnInit {

  public becarios: IBecario[];
  private tareas: ITarea[];

  public showBecarios;

  public selected: string;

  public semestres = [];

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.selected = 'Todos';
    this.service.getTareas().then((t: any) => {
      this.tareas = t;
    }).then(() => {
      this.service.getBecarios().then(async (b: any) => {
        for (let i in b) {
          b[i].ahours = 0;
          for (let t of this.tareas) {
            if (!t.finished && t.becarios.includes(b[i]._id)) {
              // console.log(t, b[i], 'includes')
              b[i].ahours += await t.hours;
            }
          }
        }
        this.becarios = await b;
        this.showBecarios = b;
        b.forEach(e => {
          if (!this.semestres.includes(e.semester))
            this.semestres.push(e.semester);
        });
      })
    })
  }

  public addBecario() {

    Swal.mixin({
      title: 'Nuevo becario',
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
      preConfirm: (val: string) => {
        if (val.length > 0)
          return val;
        Swal.showValidationMessage('Ingrese un valor.');
      }
    }).queue([
      'Nombre',
      'Semestre'
    ]).then(async (result: any) => {
      if (result.value) {
        const answers = await result.value;
        const b = await {
          name: answers[0],
          semester: answers[1],
        }
        let r: any = await this.service.createBecario(b)
        await this.becarios.push(r);
        if (!this.semestres.includes(answers[1]))
          await this.semestres.push(answers[1]);
        await this.sort('any');
        await Swal.fire({
          title: 'Created',
          icon: 'success'
        })
      }
    })

    // Swal.fire({
    //   title: 'Nuevo becario',
    //   text: 'Nombre:',
    //   input: 'text',
    //   preConfirm: (name) => {
    //     if (name.length > 0) return true;
    //     Swal.showValidationMessage('Ingrese un nombre.');
    //   }
    // }).then(r => {
    //   console.log(r)
    //   if (r.isConfirmed) {
    //     this.becarios.push({
    //       _id: `${this.becarios.length + 1}`,
    //       name: 'n',
    //       semester
    //     })
    //     Swal.fire('Created', '', 'success');
    //   }
    // });
  }

  public async sort(s) {
    // console.log('sorting')
    if (s === 'any') {
      // console.log('any')
      this.selected = 'Todos';
      this.showBecarios = [...this.becarios];
      return;
    }

    // console.log(s)
    this.selected = s;
    this.showBecarios = this.becarios.filter(b => b.semester === s);
  }

}
