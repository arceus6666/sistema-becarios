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

  public becarios: IBecario[] = [];
  private tareas: ITarea[];
  public semestres: ISemestre[] = [];

  public showBecarios = [];

  public selected: string;
  public selectedid: string;


  constructor(
    private service: AppService
  ) { }

  async ngOnInit() {
    this.selected = 'Todos';
    this.selectedid = '0';
    await this.service.getTareas().then((t: any) => {
      this.tareas = t;
    })
    await this.service.getSemestres().then((s: any) => {
      this.semestres = s;
    })
    // }).then(() => {
    await this.service.getBecarios().then(async (b: any[]) => {
      // await console.log(this.semestres)
      // console.log(this.becarios);
      for (let i in b) {
        b[i].curso = 0;
        for (let t of this.tareas) {
          // console.log(i, t)
          if (!t.finished && t.becarios.includes(b[i]._id)) {
            // console.log(t, b[i], 'includes')
            b[i].curso += await t.hours;
          }
        }
      }
      this.becarios = b.concat();
      // console.log(this.becarios);
      // this.show = await b;
      // this.showBecarios = b;
      this.sort({ _id: 0 });
      // b.forEach(e => {
      //   if (!this.semestres.includes(e.semester))
      //     this.semestres.push(e.semester);
      // });
    })
    // })
  }

  public async getSemestre(id) {
    const s = await this.semestres.find(s => s._id === id)
    return await s ? s.name : 'No asignado';
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
      progressSteps: ['1', '2', '3'],
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
        title: 'Gestion',
        input: 'select',
        inputOptions,
        inputValue: this.semestres[this.semestres.length - 1]._id
      },
      {
        title: 'Horas asignadas',
        input: 'number',
        inputValue: 0
      }
    ]).then(async (result: any) => {
      if (result.value) {
        const answers = await result.value;
        const b = await {
          name: answers[0],
          semester: answers[1],
          asignadas: parseInt(answers[2])
        }
        let error = false;
        let r: any = await this.service.createBecario(b).catch(e => { error = true });
        // await console.log(r)
        if (error) {
          Swal.fire('Error', 'Please try again later.', 'error');
          return;
        }
        // await console.log(r)
        // r.semester = await this.semestres.find(s => s._id === answers[1]).name;
        // await console.log(r)
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

  public async editar(id) {

    let i = this.becarios.findIndex(bb => bb._id === id)
    let b = this.becarios[i];
    // console.log(b)
    // const inputOptions = {}
    // for (let s of this.semestres) {
    //   inputOptions[s._id] = await s.name;
    // }
    // b.curso = 0;
    Swal.mixin({
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1'],
      // progressSteps: ['1', '2', '3', '4'],
    }).queue([
      {
        title: 'Nombre',
        input: 'text',
        inputValue: b.name,
        preConfirm: (val: string) => {
          if (val.length > 0) return val;
          Swal.showValidationMessage('El nombre no puede estar vacío')
        }
      },
      // {
      //   title: 'Horas cumplidas',
      //   input: 'number',
      //   inputValue: b.cumplidas,
      // },
      // {
      //   title: 'Horas asignadas',
      //   input: 'number',
      //   inputValue: b.asignadas,
      // },
      // {
      //   title: 'Gestión',
      //   icon: 'warning',
      //   text: '(Cambiar la gestión borrará la lista de tareas de este becario)',
      //   input: 'select',
      //   inputOptions,
      //   inputValue: b.semester
      // }
    ]).then((result: any) => {
      Swal.showLoading();
      const answers: string[] = result.value;
      if (answers) {
        const nb: IBecario = {
          _id: b._id,
          name: answers[0],
          cumplidas: b.cumplidas,
          asignadas: b.asignadas,
          semester: b.semester,
          tareas: b.tareas
        }
        this.service.modifyBecario(nb).then((bb: any) => {
          this.becarios[i] = bb;
          this.sort({ _id: this.selectedid })
          Swal.fire('Modificado', '', 'success')
        })

        // console.log(nb)
      }
    })
  }

  public async remove(id) {
    const i = await this.becarios.findIndex(ss => ss._id === id);
    // console.log(i)
    await Swal.fire({
      title: 'Eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result: any) => {
      if (result.value) {
        this.service.deleteBecario(id).then(r => {
          this.becarios.splice(i, 1);
          this.sort({ _id: 0 });
          Swal.fire('Eliminado', '', 'success');
        })
      }
    })
  }

  public sort(s) {
    // console.log('sorting')
    this.showBecarios = [];
    const found = this.semestres.findIndex(e => e._id === s._id);
    if (found < 0) {
      this.selected = 'Todos';
      this.becarios.forEach(b => {
        const bb = {
          _id: b._id,
          name: b.name,
          cumplidas: b.cumplidas,
          asignadas: b.asignadas,
          curso: b.curso,
          // totales: b.totales,
          semester: this.semestres.find(ss => ss._id === b.semester).name,
          tareas: b.tareas,
        }
        this.showBecarios.push(bb)
      })
      return;
    }
    this.selected = s.name;
    this.selectedid = s._id;
    // console.log(this.semestres)
    this.becarios.forEach(b => {
      if (s._id === b.semester) {
        // console.log(b)
        const bb = {
          _id: b._id,
          name: b.name,
          cumplidas: b.cumplidas,
          asignadas: b.asignadas,
          curso: b.curso,
          // totales: b.totales,
          semester: this.semestres.find(ss => ss._id === b.semester).name,
          tareas: b.tareas,
        }
        this.showBecarios.push(bb)
      }
    })
    // this.showBecarios = this.becarios.filter(b => b.semester === s.name);
  }

}
