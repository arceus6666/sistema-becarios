import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { IBecario } from '../interfaces/becario.interface';
import { ISemestre } from '../interfaces/semestre.interface';
import { ITarea } from '../interfaces/tarea.interface';

@Component({
  selector: 'app-becarios',
  templateUrl: './becarios.component.html',
  styleUrls: ['./becarios.component.scss']
})
export class BecariosComponent implements OnInit {

  public becarios: IBecario[];
  private tareas: ITarea[];
  public semestres: ISemestre[] = [];

  public showBecarios;

  public selected: string;


  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.selected = 'Todos';
    this.service.getTareas().then((t: any) => {
      this.tareas = t;
    }).then(() => {
      this.service.getSemestres().then((s: any) => {
        this.semestres = s;
      })
    }).then(() => {
      this.service.getBecarios().then(async (b: any) => {
        // await console.log(this.semestres)
        for (let i in b) {
          b[i].ahours = 0;
          const sem = await this.semestres.find(s => b[i].semester === s._id);
          b[i].semester = await sem.name;
          for (let t of this.tareas) {
            if (!t.finished && t.becarios.includes(b[i]._id)) {
              // console.log(t, b[i], 'includes')
              b[i].ahours += await t.hours;
            }
          }
        }
        this.becarios = await b;
        // this.showBecarios = b;
        this.sort({ _id: 0 });
        // b.forEach(e => {
        //   if (!this.semestres.includes(e.semester))
        //     this.semestres.push(e.semester);
        // });
      })
    })
  }

  public getSemestre(id) {
    return this.semestres.find(s => s._id === id).name;
  }

  public async addBecario() {

    const inputOptions = {};

    for (let s of this.semestres) {
      inputOptions[s._id] = await s.name;
    }

    await Swal.mixin({
      title: 'Nuevo becario',
      // input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
    }).queue([
      {
        title: 'Nombre',
        input: 'text',
        preConfirm: (val: string) => {
          if (val.length > 0)
            return val;
          Swal.showValidationMessage('Ingrese un valor.');
        }
      },
      {
        title: 'Semestre',
        input: 'select',
        inputOptions,
        inputValue: this.semestres[this.semestres.length - 1]._id
      }
    ]).then(async (result: any) => {
      if (result.value) {
        const answers = await result.value;
        const b = await {
          name: answers[0],
          semester: answers[1],
        }
        // await console.log(b)
        let error = false;
        let r: any = await this.service.createBecario(b).catch(e => { error = true });
        if (error) {
          Swal.fire('Error', 'Please try again later.', 'error');
          return;
        }
        r.semester = await this.semestres.find(s => s._id === answers[1]);
        await this.becarios.push(r);
        // if (!this.semestres.includes(answers[1]))
        //   await this.semestres.push(answers[1]);
        await this.sort({ _id: 0 });
        await Swal.fire({
          title: 'Created',
          icon: 'success'
        });
      }
    });
  }

  public async sort(s) {
    // console.log('sorting')
    const found = await this.semestres.findIndex(e => e._id === s._id);
    if (found < 0) {
      // console.log('any')
      this.selected = await 'Todos';
      // await console.log(this.becarios)
      this.showBecarios = await [...this.becarios];
      // await console.log(this.showBecarios)
      return;
    } //else {
    // console.log(s)
    this.selected = await s.name;
    this.showBecarios = await this.becarios.filter(b => b.semester === s.name);
    // }

    // this.showBecarios = await this.showBecarios.map(async (sb) => {
    //   await console.log(sb)
    //   sb.semester = await this.getSemestre(sb.semester);
    //   await console.log(sb)
    //   return await sb;
    // });
  }

}
