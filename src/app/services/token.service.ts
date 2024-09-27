import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private secretKey: string = environment.url;

  constructor() { }

  generarToken(data: any): string {
    const token = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return token;
  }

  desencriptarToken(token: string): any {
    const bytes = CryptoJS.AES.decrypt(token, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedData);
  }
}
