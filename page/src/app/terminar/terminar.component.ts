import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { IBecario } from '../interfaces/becario.interface';
import { ITarea } from '../interfaces/tarea.interface';

@Component({
  selector: 'app-terminar',
  templateUrl: './terminar.component.html',
  styleUrls: ['./terminar.component.scss']
})
export class TerminarComponent implements OnInit {

  public tarea: ITarea;
  public becarios: IBecario[];
  public horas: any[];

  constructor(
    private servicio: AppService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.servicio.getBecarios().then((b: any) => {
      this.becarios = b;
    }).then(() => {
      this.servicio.getTareaById(this.route.snapshot.params.id).then(async (t: any) => {
        this.tarea = await t;
        this.horas = []
        for (let i in this.tarea.becarios) {
          let name = await this.becarios.find(e => e._id === this.tarea.becarios[i]).name;
          let hours = await this.tarea.hours;
          this.horas.push({ name, hours })
        }
      })
    })
  }

  public async asignar() {
    for (let i in this.horas) {
      let b = await this.becarios.find(bb => bb.name === this.horas[i].name);
      b.tareas = await b.tareas.filter(t => t !== this.tarea._id)
      // b.asignadas -= await this.horas[i];
      b.cumplidas += await this.horas[i].hours;
      await this.servicio.modifyBecario(b);
    }
    this.tarea.finished = await true;
    await this.servicio.modifyTarea(this.tarea);
    await Swal.fire('Tarea terminda', '', 'success').then(() => {
      this.router.navigate(['/tareas'])
    })
  }

}
