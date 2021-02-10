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

  public ordenar = {
    nombre: 0,
    faltantes: 0,
    asignadas: 0,
    totales: 0,
    cumplidas: 0,
    curso: 0,
  }

  constructor(
    private service: AppService
  ) { }

  async ngOnInit() {
    // this.selected = 'Todos';
    this.selectedid = '0';
    await this.service.getTareas().then((t: any) => {
      this.tareas = t;
    })
    await this.service.getSemestres().then((s: any) => {
      this.semestres = s;
      // console.log(s[s.length - 1].name)
    })
    // }).then(() => {
    await this.service.getBecarios().then(async (b: IBecario[]) => {
      // await console.log(this.semestres)
      for (let i in b) {
        // await console.log(b[i]);
        b[i].curso = 0;
        for (let t of this.tareas) {
          // console.log(i, t)
          if (!t.finished && t.becarios.includes(b[i]._id)) {
            // console.log(t, b[i], 'includes')
            b[i].curso += await t.hours;
          }
        }
        b[i].faltantes = await (b[i].asignadas - b[i].curso - b[i].cumplidas);
        b[i].totales = await (b[i].curso + b[i].cumplidas);
        // await console.log(b[i]);
      }
      this.becarios = await b.concat();
      // console.log(this.becarios);
      // this.show = await b;
      // this.showBecarios = b;
      // b.forEach(e => {
      //   if (!this.semestres.includes(e.semester))
      //     this.semestres.push(e.semester);
      // });
    })
    // })
    if (this.semestres.length > 0) {
      await this.sort({ _id: this.semestres[this.semestres.length - 1]._id });
      this.selected = await this.semestres[this.semestres.length - 1].name;
    }
  }

  public async getSemestre(id) {
    const s = await this.semestres.find(s => s._id === id)
    return await s ? s.name : 'No asignado';
  }

  public async addBecario() {

    if (this.semestres.length < 1) {
      Swal.fire('Debe crear un semestre primero', '', 'error')
      return;
    }

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
        r.curso = await 0
        r.faltantes = await r.asignadas;
        r.totales = await 0;
        await this.becarios.push(r);
        // if (!this.semestres.includes(answers[1]))
        //   await this.semestres.push(answers[1]);
        await this.sort({ _id: this.semestres[this.semestres.length - 1]._id });
        await Swal.fire({
          title: 'Created',
          icon: 'success'
        });
      }
    });
  }

  public async editar(id) {

    let i = this.becarios.findIndex(bb => bb._id === id)
    let b = JSON.parse(JSON.stringify(this.becarios[i]));
    // await console.log(b)
    const inputOptions = {}
    for (let s of this.semestres) {
      inputOptions[s._id] = await s.name;
    }
    Swal.mixin({
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      // progressSteps: ['1'],
      progressSteps: ['1', '2', '3',],
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
      {
        title: 'Horas asignadas',
        input: 'number',
        inputValue: b.asignadas,
      },
      {
        title: 'Gestión',
        icon: 'warning',
        text: '(Cambiar la gestión borrará la lista de tareas de este becario)',
        input: 'select',
        inputOptions,
        inputValue: b.semester
      }
    ]).then((result: any) => {
      Swal.showLoading();
      const answers: string[] = result.value;
      if (answers) {
        const nb: IBecario = {
          _id: b._id,
          name: answers[0],
          asignadas: parseInt(answers[1]),
          cumplidas: b.cumplidas,
          semester: answers[2],
          tareas: b.tareas,
          totales: b.totales,
          curso: b.curso
          // faltantes:b.faltantes
        }
        // nb.faltantes = nb.asignadas - nb.curso - nb.cumplidas;
        // console.log(nb)
        this.service.modifyBecario(nb).then(async (bb: any) => {
          // await console.log(bb)
          bb.curso = await 0;
          for (let t of this.tareas) {
            // console.log(i, t)
            if (!t.finished && t.becarios.includes(bb._id)) {
              // console.log(t, b[i], 'includes')
              bb.curso += await t.hours;
            }
          }
          bb.totales = bb.curso + bb.cumplidas
          bb.faltantes = b.asignadas - bb.curso - bb.cumplidas
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

  public sort(s, tipo: number = -1) {
    this.showBecarios = [];
    const found = this.semestres.findIndex(e => e._id === s._id);
    if (found < 0) {
      this.selected = 'Todos';
      this.becarios.forEach(b => {
        // console.log(b)
        const bb = {
          _id: b._id,
          name: b.name,
          cumplidas: b.cumplidas,
          asignadas: b.asignadas,
          curso: b.curso,
          totales: b.totales,
          faltantes: b.faltantes,
          semester: this.semestres.find(ss => ss._id === b.semester).name,
          tareas: b.tareas,
        }
        this.showBecarios.push(bb)
      })
      switch (tipo) {
        case 0:
          // console.log('sorting', 0)
          this.ordenar.asignadas = 0;
          this.ordenar.cumplidas = 0;
          this.ordenar.curso = 0;
          this.ordenar.totales = 0;
          this.ordenar.faltantes = 0;
          if (this.ordenar.nombre > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.nombre === 1) return a.name < b.name ? -1 : 1
              else return a.name < b.name ? 1 : -1
            })
          return;
        case 1:
          // console.log('sorting', 1)
          this.ordenar.asignadas = 0;
          this.ordenar.cumplidas = 0;
          this.ordenar.curso = 0;
          this.ordenar.totales = 0;
          this.ordenar.nombre = 0;
          if (this.ordenar.faltantes > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.faltantes === 1) return a.faltantes - b.faltantes
              else return b.faltantes - a.faltantes
            })
          return;
        case 2:
          // console.log('sorting', 2)
          this.ordenar.nombre = 0;
          this.ordenar.cumplidas = 0;
          this.ordenar.curso = 0;
          this.ordenar.totales = 0;
          this.ordenar.faltantes = 0;
          if (this.ordenar.asignadas > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.asignadas === 1) return a.asignadas - b.asignadas
              else return b.asignadas - a.asignadas
            })
          return;
        case 3:
          // console.log('sorting', 3)
          this.ordenar.asignadas = 0;
          this.ordenar.cumplidas = 0;
          this.ordenar.curso = 0;
          this.ordenar.nombre = 0;
          this.ordenar.faltantes = 0;
          if (this.ordenar.totales > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.totales === 1) return a.totales - b.totales
              else return b.totales - a.totales
            })
          return;
        case 4:
          // console.log('sorting', 4)
          this.ordenar.asignadas = 0;
          this.ordenar.nombre = 0;
          this.ordenar.curso = 0;
          this.ordenar.totales = 0;
          this.ordenar.faltantes = 0;
          if (this.ordenar.cumplidas > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.cumplidas === 1) return a.cumplidas - b.cumplidas
              else return b.cumplidas - a.cumplidas
            })
          return;
        case 5:
          // console.log('sorting', 5)
          this.ordenar.asignadas = 0;
          this.ordenar.cumplidas = 0;
          this.ordenar.nombre = 0;
          this.ordenar.totales = 0;
          this.ordenar.faltantes = 0;
          if (this.ordenar.curso > 0)
            this.showBecarios.sort((a, b) => {
              if (this.ordenar.curso === 1) return a.name - b.curso
              else return b.curso - a.curso
            })
          return;
        default:
          return;
      }
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
          totales: b.totales,
          faltantes: b.faltantes,
          semester: this.semestres.find(ss => ss._id === b.semester).name,
          tareas: b.tareas,
        }
        this.showBecarios.push(bb)
      }
    })
    switch (tipo) {
      case 0:
        // console.log('sorting', 0, this.ordenar.nombre)
        this.ordenar.asignadas = 0;
        this.ordenar.cumplidas = 0;
        this.ordenar.curso = 0;
        this.ordenar.totales = 0;
        this.ordenar.faltantes = 0;
        if (this.ordenar.nombre > 0) {
          // console.log('sort', this.ordenar.nombre === 1)
          this.showBecarios.sort((a, b) => {
            // console.log(a.name, b.name)
            if (this.ordenar.nombre === 1) return a.name < b.name ? -1 : 1
            else return a.name < b.name ? 1 : -1
          })
        }
        return;
      case 1:
        // console.log('sorting', 1)
        this.ordenar.asignadas = 0;
        this.ordenar.cumplidas = 0;
        this.ordenar.curso = 0;
        this.ordenar.totales = 0;
        this.ordenar.nombre = 0;
        if (this.ordenar.faltantes > 0)
          this.showBecarios.sort((a, b) => {
            if (this.ordenar.faltantes === 1) return a.faltantes - b.faltantes
            else return b.faltantes - a.faltantes
          })
        return;
      case 2:
        // console.log('sorting', 2)
        this.ordenar.nombre = 0;
        this.ordenar.cumplidas = 0;
        this.ordenar.curso = 0;
        this.ordenar.totales = 0;
        this.ordenar.faltantes = 0;
        if (this.ordenar.asignadas > 0)
          this.showBecarios.sort((a, b) => {
            if (this.ordenar.asignadas === 1) return a.asignadas - b.asignadas
            else return b.asignadas - a.asignadas
          })
        return;
      case 3:
        // console.log('sorting', 3)
        this.ordenar.asignadas = 0;
        this.ordenar.cumplidas = 0;
        this.ordenar.curso = 0;
        this.ordenar.nombre = 0;
        this.ordenar.faltantes = 0;
        if (this.ordenar.totales > 0)
          this.showBecarios.sort((a, b) => {
            if (this.ordenar.totales === 1) return a.totales - b.totales
            else return b.totales - a.totales
          })
        return;
      case 4:
        // console.log('sorting', 4)
        this.ordenar.asignadas = 0;
        this.ordenar.nombre = 0;
        this.ordenar.curso = 0;
        this.ordenar.totales = 0;
        this.ordenar.faltantes = 0;
        if (this.ordenar.cumplidas > 0)
          this.showBecarios.sort((a, b) => {
            if (this.ordenar.cumplidas === 1) return a.cumplidas - b.cumplidas
            else return b.cumplidas - a.cumplidas
          })
        return;
      case 5:
        // console.log('sorting', 5)
        this.ordenar.asignadas = 0;
        this.ordenar.cumplidas = 0;
        this.ordenar.nombre = 0;
        this.ordenar.totales = 0;
        this.ordenar.faltantes = 0;
        if (this.ordenar.curso > 0)
          this.showBecarios.sort((a, b) => {
            if (this.ordenar.curso === 1) return a.name - b.curso
            else return b.curso - a.curso
          })
        return;
      default:
        return;
    }

    // this.showBecarios = this.becarios.filter(b => b.semester === s.name);
  }

}
