import { Component, OnInit, Input } from '@angular/core';

import { Provider, AuthServer } from './../../models/provider';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  authServers: AuthServer[] = [
    new AuthServer('@tlas', 'http://46.101.7.84:9082/api/v1')
//    new AuthServer('@tlas', 'http://127.0.0.1:9082/api/v1')
  ];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    for (let server of this.authServers) {
      this.updateAuthServer(server);
    }
  }

  updateAuthServer(server: AuthServer) {
    server.reset();
    this.authService.getProviders(server.host).subscribe(
      (v) => {
        server.providers = v;
        // active status will be received via anoher call
        server.providers.forEach(p => p.active = false);
      },
      (err) => {
        server.done(err);
      },
      () => {
        server.done();
      }
    );
  }

  getProviderIcon(provider: Provider) {
    if (provider.icon) {
      return provider.icon;
    }
    return `assets/imgs/providers/${provider.id}.png`;
  }

}
