import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://localhost:7890';

  constructor(
    private httpClient: HttpClient
  ) { }

  public async getBecarios() {
    return new Promise((res, rej) => {
      this.httpClient.get(`${this.url}/becarios/all`).subscribe(r => {
        res(r);
      }, rej);
    });
  }

  public async getTareas() {
    return new Promise((res, rej) => {
      this.httpClient.get(`${this.url}/tareas/all`).subscribe(r => {
        res(r)
      }, rej)
    });
  }

  public async getSemestres() {
    return new Promise((res, rej) => {
      this.httpClient.get(`${this.url}/semestres/all`).subscribe(r => {
        res(r);
      }, rej);
    })
  }

  public async getTareaById(id: string) {
    return new Promise((res, rej) => {
      this.httpClient.get(`${this.url}/tareas/find/` + id).subscribe(r => {
        res(r)
      }, rej)
    });
  }

  public createBecario(body) {
    return new Promise((res, rej) => {
      this.httpClient.post(`${this.url}/becarios/add`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public createTarea(body) {
    return new Promise((res, rej) => {
      this.httpClient.post(`${this.url}/tareas/add`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public createSemestre(body) {
    return new Promise((res, rej) => {
      this.httpClient.post(`${this.url}/semestres/add`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public modifyBecario(body) {
    return new Promise((res, rej) => {
      this.httpClient.put(`${this.url}/becarios/update/${body._id}`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }

  public modifyTarea(body) {
    return new Promise((res, rej) => {
      this.httpClient.put(`${this.url}/tareas/update/${body._id}`, body).subscribe(r => {
        res(r);
      }, rej)
    })
  }
}
