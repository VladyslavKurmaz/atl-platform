import { Component, OnInit } from '@angular/core';

import { Provider } from './../../models/provider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  providers: Provider[] = [];

  constructor() { }

  ngOnInit() {
  }

}
