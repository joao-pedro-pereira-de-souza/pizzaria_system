import bcrypt from 'bcryptjs';

import { CryptoCipherService  } from './crypto.cipher.service';


export class CryptoService {

  static cipher = CryptoCipherService.cipher;

  static generate(value: string): string {
    return bcrypt.hashSync(value, 10);
  }

  static compare(value_input: string, hash_compare: string): boolean {
    return bcrypt.compareSync(value_input, hash_compare);
  }

}
