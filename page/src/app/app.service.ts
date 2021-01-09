import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public async getBecarios() {
    return new Promise((res, rej) => {
      this.httpClient.get('http://localhost:7890/becarios/all').subscribe(r => {
        res(r);
      }, rej);
    });
  }

  public async getTareas() {
    return new Promise((res, rej) => {
      this.httpClient.get('http://localhost:7890/tareas/all').subscribe(r => {
        res(r)
      }, rej)
    });
  }

  public async getTareaById(id: string) {
    return new Promise((res, rej) => {
      this.httpClient.get('http://localhost:7890/tareas/find/' + id).subscribe(r => {
        res(r)
      }, rej)
    });
  }

  public createBecario(body) {
    return new Promise((res, rej) => {
      this.httpClient.post('http://localhost:7890/becarios/add', body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public createTarea(body) {
    return new Promise((res, rej) => {
      this.httpClient.post('http://localhost:7890/tareas/add', body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public modifyBecario(body) {
    return new Promise((res, rej) => {
      this.httpClient.put(`http://localhost:7890/becarios/update/${body._id}`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public modifyTarea(body) {
    return new Promise((res, rej) => {
      this.httpClient.put(`http://localhost:7890/tareas/update/${body._id}`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }
}
