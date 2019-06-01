import { Entity, Email, Phone, Address } from './entity';

/* 
 *
 * TODO: implement emails, phones, sddresses as structure { 'primary': 'email@my.com', more: {'secondary': 'email2@backpup.com'}}
 */

// TODO
export class Contact extends Entity{
  email?: Email;
  emails?: Email[];
  phone?: Phone;
  phones?: Phone[];
  address?: Address;
  addresses?: Address[];
}
