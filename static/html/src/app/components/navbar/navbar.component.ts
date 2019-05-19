import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Tenant } from '../../models/tenant';
import { NavbarItem } from './../../models/navbar-item';

import { TenantsService } from '../../services/tenants.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: NavbarItem[] = [
    { id: 'contacts', group: false },
    { id: 'goals', group: false },
    { id: 'flows', group: false },
    { id: 'docs', group: false },
//    { id: 'search', group: true },
    { id: 'apps', group: true },
    { id: 'settings', group: false }
  ];
  
  isTenant = false;
  companyName = "";
  styles: any = {};
  subsTenant: Subscription;

  constructor(private router: Router, private tenantsService: TenantsService) {
    console.log('Navbar constructor');
  }

  ngOnInit() {
    console.log('Navbar init');
    this.subsTenant = this.tenantsService.change.subscribe(tenant => {
      this.updateTenant(tenant);
    });
    this.tenantsService.update();
  }
  ngOnDestroy() {
    if (this.subsTenant) {
      this.subsTenant.unsubscribe()
    }
  }

  updateTenant(tenant: Tenant) {
    console.log('Tenant:', tenant);
    this.isTenant = tenant != null;
    if (tenant) {
      this.isTenant = true;
      this.companyName = tenant.name;
      this.styles = tenant.styles;
    } else {
      this.isTenant = false;
      this.companyName = "attlas";
    }

  }

  isCurrentPage(item: NavbarItem): boolean {
    return (this.router.url.indexOf(item.id) > -1);
  }

  activateRouteItem(item: NavbarItem) {
    this.router.navigate(['/' + item.id]);
  }

}
