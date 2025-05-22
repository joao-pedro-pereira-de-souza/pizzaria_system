import crypto from 'crypto';
import { InternalServerError } from '../../error/erros.mudule';

export class CryptoCipherService {
  constructor(
    private readonly method: 'aes-256-gcm',
    private readonly key: string,
    private readonly iv: string
  ) {}

  static cipher(method: 'aes-256-gcm', key: string, iv: string) {
    const keycrypto = crypto
      .createHash('sha512')
      .update(key)
      .digest('hex')
      .substring(0, 32);

    const encryptionIV = crypto
      .createHash('sha512')
      .update(iv)
      .digest('hex')
      .substring(0, 16);

    return new CryptoCipherService(method, keycrypto, encryptionIV);
  }

  encrypt(data: string) {

    try {
      const cipher = crypto.createCipheriv(this.method, this.key, this.iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag(); // Gera o authTag
      return Buffer.from(encrypted + '::' + authTag.toString('hex')).toString(
        'base64'
      );

    } catch (error) {
      throw new InternalServerError('error module encrypt crypto.cipher.service', error);
    }

  }

  decrypt(value_crypted: string) {

    try {
      const buff = Buffer.from(value_crypted, 'base64').toString('utf8');
      const [encryptedData, authTagHex] = buff.split('::');

      const decipher = crypto.createDecipheriv(this.method, this.key, this.iv);
      decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;

    } catch (error) {
      throw new InternalServerError('error module decrypt crypto.cipher.service', error);
    }

  }
}
