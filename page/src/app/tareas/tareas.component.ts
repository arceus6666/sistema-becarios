import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppService } from '../app.service';
import { IBecario } from '../interfaces/becario.interface';
import { ISemestre } from '../interfaces/semestre.interface';
import { ITarea } from '../interfaces/tarea.interface';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {

  public tareas: ITarea[];
  public becarios: IBecario[];
  public semestres: ISemestre[] = [];
  // public showSemestres: string[] = [];
  public showTareas = [];
  public selected: number = null;
  public hidden = true;
  public semestre = null;
  public terminadas = 0;

  constructor(
    private service: AppService
  ) { }

  async ngOnInit() {
    await this.service.getTareas().then((r: any) => {
      this.tareas = r.concat();
      // console.log(r)
      r.forEach(t => { if (t.finished) this.terminadas++; });
      this.selected = 0;
    })
    await this.service.getBecarios().then((b: any) => {
      // console.log(b)
      this.becarios = b;
    })

    await this.service.getSemestres().then((s: any) => {
      this.semestres = s;
      // this.showSemestres = s.map(e => e.name);
      // console.log(s);
    });

    await this.sort();
    this.semestre = await this.semestres[this.semestres.length - 1].name;
    // await console.log(this.terminadas, this.showTareas.length)

  }

  public async addTarea() {
    const inputOptions = {};

    // await console.log('io')

    for (let s of this.semestres) {
      inputOptions[s._id] = await s.name;
    }

    // await console.log(inputOptions)

    await Swal.mixin({
      // input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4', '5']
    }).queue([
      {
        title: 'Nombre',
        input: 'text',
        preConfirm: (val: string) => {
          if (val.length > 0)
            return val;
          Swal.showValidationMessage('Ingrese un valor.');
        },
      },
      {
        title: 'Semestre',
        input: 'select',
        inputOptions,
        inputValue: this.semestres[this.semestres.length - 1]._id,
      },
      {
        title: 'Fecha de inicio',
        text: 'Formato: "dd/MM/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let p = val.split('/');
          let d = Date.parse(`${p[1]}/${p[0]}/${p[2]}`);
          if (!isNaN(d))
            return d;
          Swal.showValidationMessage('Ingrese una fecha válida.');
        },
      },
      {
        title: 'Fecha de fin',
        text: 'Formato: "dd/MM/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let p = val.split('/');
          let d = Date.parse(`${p[1]}/${p[0]}/${p[2]}`);
          if (!isNaN(d))
            return d;
          Swal.showValidationMessage('Ingrese una fecha válida.');
        },
      },
      {
        title: 'Horas',
        input: 'number',
        inputPlaceholder: '0',
        inputValue: 0,
      }
    ]).then(async (result: any) => {
      if (result.value) {
        const answers = await result.value
        const t = await {
          name: answers[0],
          semester: answers[1],
          bdate: answers[2],
          edate: answers[3],
          hours: answers[4]
        }
        // await console.log(await t, await this.tareas, await this.tareas.length)
        // 20/1/2021
        let tarea: any = await this.service.createTarea(t);
        // await this.service.createTarea(t).then(async (tarea: ITarea) => {
        // });
        await this.tareas.push(await tarea);
        // await console.log(await this.tareas, await this.tareas.length)
        await this.sort();
        // tarea.semester = await t.semester
        // await console.log(tarea, tarea.semester)
        // if (this.tareas.length < 1)
        //   this.selected = await this.tareas[0];
        await Swal.fire('Creada', '', 'success')
      }
    })
  }

  public async editar(id) {

    let i = this.tareas.findIndex(bb => bb._id === id)
    let t = this.tareas[i];
    let bdate = new Date(parseInt(t.bdate))
    let edate = new Date(parseInt(t.edate))
    // console.log(bdate, edate)
    const inputOptions = {}
    for (let s of this.semestres) {
      inputOptions[s._id] = await s.name;
    }
    // b.curso = 0;
    Swal.mixin({
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4', '5'],
    }).queue([
      {
        title: 'Nombre',
        input: 'text',
        inputValue: t.name,
        preConfirm: (val: string) => {
          if (val.length > 0) return val;
          Swal.showValidationMessage('El nombre no puede estar vacío')
        },
      },
      {
        title: 'Fecha de inicio',
        text: 'Formato: "dd/MM/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let p = val.split('/');
          let d = Date.parse(`${p[1]}/${p[0]}/${p[2]}`);
          if (!isNaN(d))
            return d;
          Swal.showValidationMessage('Ingrese una fecha válida.');
        },
        inputValue: `${bdate.getDate()}/${bdate.getMonth() + 1}/${bdate.getFullYear()}`
      },
      {
        title: 'Fecha de fin',
        text: 'Formato: "dd/MM/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let p = val.split('/');
          let d = Date.parse(`${p[1]}/${p[0]}/${p[2]}`);
          if (!isNaN(d))
            return d;
          Swal.showValidationMessage('Ingrese una fecha válida.');
        },
        inputValue: `${edate.getDate()}/${edate.getMonth() + 1}/${edate.getFullYear()}`
      },
      {
        title: 'Hours',
        input: 'number',
        inputValue: t.hours
      },
      {
        title: 'Gestión',
        icon: 'warning',
        text: '(Cambiar la gestión borrará la tareas de la lista de todos los becarios)',
        input: 'select',
        inputOptions,
        inputValue: t.semester
      },
    ]).then((result: any) => {
      Swal.showLoading();
      const answers: string[] = result.value;
      if (answers) {
        const nt: ITarea = {
          _id: t._id,
          name: answers[0],
          bdate: answers[1],
          edate: answers[2],
          hours: parseInt(answers[3]),
          semester: answers[4],
          becarios: t.becarios,
          finished: t.finished
        }
        this.service.modifyTarea(nt).then((tt: any) => {
          this.tareas[i] = tt;
          this.sort()
          Swal.fire('Modificado', '', 'success')
        })

        // console.log(nb)
      }
    })
  }

  public async remove(id) {
    const i = await this.tareas.findIndex(ss => ss._id === id);
    console.log(i)
    await Swal.fire({
      title: 'Eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result: any) => {
      if (result.value) {
        this.service.deleteTarea(id).then(r => {
          this.tareas.splice(i, 1);
          this.sort();
          Swal.fire('Eliminado', '', 'success');
        })
      }
    })
  }

  public toShort(date) {
    // console.log()
    let h = date.getHours() + 1;
    // return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${h > 12 ? h : h - 12}:${date.getMinutes()} ${h > 12 ? 'P' : 'A'}M`;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  public async tareaABecario() {
    let inputOptions = {};

    for (let i in this.becarios) {
      // await console.log(this.becarios[i].semester, this.selected.semester)
      const sem = await this.idASemestre(this.becarios[i].semester)
      // await console.log(sem)
      if (this.becarios[i].semester === this.tareas[this.selected].semester && !this.tareas[this.selected].becarios.includes(this.becarios[i]._id))
        inputOptions[this.becarios[i]._id] = await this.becarios[i].name;
    }

    // await console.log(inputOptions)

    await Swal.fire({
      title: 'Escoja al becario',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Escoja al becario',
      showCancelButton: true,
      preConfirm: (val: string) => {
        if (val.length > 0) {
          return val;
        }
        Swal.showValidationMessage('Escoja un becario');
      }
    }).then(async (res: any) => {
      if (res.value) {
        let error = false;
        let t = await JSON.parse(JSON.stringify(this.tareas[this.selected]));
        await t.becarios.push(res.value)
        // await console.log(this.tareas[this.selected])
        // await this.tareas[this.selected].becarios.push(res.value)
        // await console.log(t)
        let tr: any = await this.service.modifyTarea(t);
        await console.log(t, tr)
        if (error) {
          Swal.fire('Error', 'Please try again later', 'error');
          return;
        }
        this.tareas[this.selected] = t;
        let b = await this.becarios.find(b => b._id === res.value);
        await b.tareas.push(this.tareas[this.selected]._id);
        await this.service.modifyBecario(b).catch(e => { error = true; });
        if (error) {
          // console.log(error)
          Swal.fire('Error', 'Please try again later', 'error');
          return;
        }
        console.log(b)
        Swal.fire('Added', '', 'success');
      }
    });
  }

  public async removeTarea(id) {
    const idx = await this.becarios.findIndex(bf => bf._id === id);
    const b = await this.becarios[idx];
    if (idx < 0) return;
    Swal.fire({
      title: `Remover a ${b.name} de esta tarea?`,
      showCancelButton: true,
      confirmButtonText: 'Remover'
    }).then(async (result: any) => {
      if (result.value) {
        this.tareas[this.selected].becarios = await this.tareas[this.selected].becarios.filter(tb => tb !== b._id);
        b.tareas = await b.tareas.filter(t => t !== this.tareas[this.selected]._id);
        await this.service.modifyBecario(b).then((r: any) => {
          this.becarios[idx] = r;
        }).catch(e => {
          Swal.fire('Error', 'Please try again later', 'error');
        })
        await this.service.modifyTarea(this.tareas[this.selected]).then((t: any) => {
          this.tareas[this.selected] = t;
          Swal.fire('Removido', '', 'success');
        }).catch(e => {
          Swal.fire('Error', 'Please try again later', 'error');
        })
      }
    })
  }

  public getName(id) {
    for (let b of this.becarios) {
      if (b._id === id) return b.name;
    }
    return '';
  }

  public sort() {
    // await console.log('sort', this.tareas)
    this.showTareas = [];
    // console.log(this.showTareas)
    this.tareas.forEach(t => {

      const tt = {
        _id: t._id,
        name: t.name,
        semester: this.semestres.find(s => s._id === t.semester).name,
        bdate: t.bdate,
        edate: t.edate,
        hours: t.hours,
        becarios: t.becarios,
        finished: t.finished
      };

      this.showTareas.push(tt);
    })
    // this.showTareas = this.tareas.map(async t => {
    //   console.log(t)
    //   console.log(tt)
    //   return tt;
    // })
    // for (let i in this.showTareas) {
    // console.log(this.showTareas)

    // this.showTareas[i].semester = await this.idASemestre(this.showTareas[i].semester)
    // await this.showTareas.push(t);
    // }
    // await console.log(this.tareas)
  }

  public async idASemestre(id: string) {
    // await console.log(id)
    // await console.log(this.semestres)
    const s = await this.semestres.find(s => s._id === id);
    // await console.log(s);
    return await s ? s.name : id;
    // return 'x'
  }

}
