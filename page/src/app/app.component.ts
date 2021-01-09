import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'page';

  ngOnInit(): void {
    Swal.fire({
      title: 'Password',
      input: 'text',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: data => {
        if (data === 'becarios2021#') {
          return true;
        }
        Swal.showValidationMessage('Wrong password');
      },
      backdrop:`
        rgba(0,0,0,1)
      `
    }).then(res => {
      if (res.isConfirmed) {
        let timerInterval;
        Swal.fire({
          title: 'Welcome',
          timer: 2000,
          didOpen: () => {
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        });
      }
    });

  }
}
