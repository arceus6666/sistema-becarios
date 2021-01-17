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
  public showTareas = [];
  public selected: ITarea = null;
  public hidden = true;
  public semestre = null;
  public terminadas = 0;

  constructor(
    private service: AppService
  ) { }

  async ngOnInit() {
    await this.service.getTareas().then((r: any) => {
      this.tareas = r;
      this.selected = r[0];
    })
    await this.service.getBecarios().then((b: any) => {
      // console.log(b)
      this.becarios = b;
    })

    await this.service.getSemestres().then((s: any) => {
      this.semestres = s;
      // console.log(s);
    });

    await this.sort();

    await this.tareas.forEach(t => { if (t.finished) this.terminadas++; });

    await console.log(this.terminadas, this.showTareas.length)

  }

  public async addTarea() {
    const inputOptions = {};

    for (let s of this.semestres) {
      inputOptions[s._id] = await s.name;
    }

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
        text: 'Formato: "MM/dd/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let d = Date.parse(val);
          if (!isNaN(d))
            return d;
          Swal.showValidationMessage('Ingrese una fecha válida.');
        },
      },
      {
        title: 'Fecha de fin',
        text: 'Formato: "MM/dd/yyyy"',
        input: 'text',
        inputPlaceholder: `${this.toShort(new Date(Date.now()))}`,
        preConfirm: (val: string) => {
          let d = Date.parse(val);
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
        await console.log(t)
        let tarea: any = await this.service.createTarea(t);
        await console.log(tarea)
        if (this.tareas.length < 1)
          this.selected = tarea;
        await this.tareas.push(tarea);
        await this.sort();
        await Swal.fire('Creada', '', 'success')
      }
    })
  }

  public toShort(date) {
    // console.log()
    let h = date.getHours() + 1;
    // return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${h > 12 ? h : h - 12}:${date.getMinutes()} ${h > 12 ? 'P' : 'A'}M`;
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  public async tareaABecario() {
    let inputOptions = {};

    for (let i in this.becarios) {
      if (this.becarios[i].semester === this.selected.semester && !this.selected.becarios.includes(this.becarios[i]._id))
        inputOptions[this.becarios[i]._id] = await this.becarios[i].name;
    }

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
        await this.selected.becarios.push(res.value)
        await this.service.modifyTarea(this.selected).catch(e => { error = true; });
        if (error) {
          Swal.fire('Error', 'Please try again later', 'error');
          return;
        }
        let b = await this.becarios.find(b => b._id === res.value);
        await b.tareas.push(this.selected._id);
        await this.service.modifyBecario(b).catch(e => { error = true; });
        if (error) {
          Swal.fire('Error', 'Please try again later', 'error');
          return;
        }
        // console.log(res)
        Swal.fire('Added', '', 'success');
      }
    });
  }

  public getName(id) {
    for (let b of this.becarios) {
      if (b._id === id) return b.name;
    }
    return '';
  }

  public async sort() {
    // console.log('sort')
    this.showTareas = await [];
    for (let i in this.tareas) {
      // await console.log(i)
      let t: any = await this.tareas[i]
      t.semester = await this.idASemestre(t.semester)
      await this.showTareas.push(t);
    }
  }

  public async idASemestre(id: string) {
    // await console.log(id)
    // await console.log(this.semestres)
    const semestre = await this.semestres.find(s => s._id === id);
    // await console.log(semestre);
    return await semestre.name;
    // return 'x'
  }

}
