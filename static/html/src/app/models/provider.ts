import { Contact } from './contact';
import { Response } from './response';

/* 
 *
 */
export class Provider extends Contact{
  authLink: string;
};

export class AuthServer {
  name: string;
  host: string;
  loading: boolean;
  error: string;
  providers: Provider[];
  private edit: boolean;

  constructor (name: string, host: string) {
    this.name = name;
    this.host = host;
    this.reset();
    this.edit = false;
  }

  isEditMode(): boolean {
    return this.edit;
  }

  setEditMode(mode: boolean) {
    this.edit = mode;
  }

  reset() {
    this.loading = true;
    this.error = '';
    this.providers = [];
  }

  done(error: string = '') {
    this.error = error;
    this.loading = false;
  }
};


export class ProvidersResponse extends Response<Provider> {
}
