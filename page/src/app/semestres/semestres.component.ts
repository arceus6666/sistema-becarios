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
    const s = this.makeSemestre();
    Swal.fire({
      title: 'Nuevo Semestre',
      text: s,
      showCancelButton: true,
      confirmButtonText: 'Create'
    }).then((result: any) => {
      if (result.value) {
        this.service.createSemestre({ name: s }).then((r: any) => {
          this.semestres.push(r);
          Swal.fire('Created', '', 'success');
        }).catch(() => {
          Swal.fire('Error', 'Please try again later', 'error');
        });
      }
    });
  }

  public makeSemestre() {
    const d = new Date(Date.now());
    const m = d.getMonth() < 6 ? 'I' : 'II';
    return `${m}-${d.getFullYear()}`;
  }

}
