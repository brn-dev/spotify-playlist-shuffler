import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-please-login',
  templateUrl: './please-login.component.html',
  styleUrls: ['./please-login.component.scss']
})
export class PleaseLoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public tryAgain(): void {
    this.router.navigateByUrl('');
  }

}
