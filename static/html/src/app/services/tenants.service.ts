import { Injectable, Output, EventEmitter } from '@angular/core';

import { Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root'
})
export class TenantsService {

  flag = false;
  @Output() change: EventEmitter<Tenant> = new EventEmitter();

  constructor() {
    console.log('tenant service constructor');
    //this.update();
  }

  update() {
    var tenant = new Tenant();
    tenant.name = "Some Company";
    tenant.logo = "assets/imgs/tenant.png";
    tenant.styles = {
      'background-color': 'lightblue'
    };
    this.change.emit(this.flag?tenant:null);
    //this.flag = !this.flag;
  }

}
