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
  private semestres: ISemestre[] = [];
  public selected: ITarea = null;

  constructor(
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.service.getTareas().then((r: any) => {
      this.tareas = r;
      this.selected = r[0];
    }).then(() => {
      this.service.getBecarios().then((b: any) => {
        // console.log(b)
        this.becarios = b;
      })
    }).then(() => {
      this.service.getSemestres().then((s: any) => {
        this.semestres = s;
      });
    });
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
        text:'Formato: "MM/dd/yyyy"',
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
        text:'Formato: "MM/dd/yyyy"',
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
    let options: SweetAlertOptions = await {
      title: 'Escoja al becario',
      input: 'select',
      inputOptions: {

      },
      inputPlaceholder: 'Escoja al becario',
      showCancelButton: true,
    }

    for (let i in this.becarios) {
      if (this.becarios[i].semester === this.selected.semester)
        options.inputOptions[this.becarios[i]._id] = await this.becarios[i].name;
    }

    await Swal.fire(options).then(async (res: any) => {
      await this.selected.becarios.push(res.value)
      await this.service.modifyTarea(this.selected)
      let b = await this.becarios.find(b => b._id === res.value);
      await b.tareas.push(this.selected._id);
      await this.service.modifyBecario(b);
      // console.log(res)
      Swal.fire('Added', '', 'success')
    })
  }

  public getName(id) {
    for (let b of this.becarios) {
      if (b._id === id) return b.name;
    }
    return '';
  }

}
