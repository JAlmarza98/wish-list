import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import * as CryptoJS from 'crypto-js';

export interface TokenData {
  groupId: string;
  invitedBy: string;
  invitationDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private secretKey: string = environment.secretKey;

  constructor() { }

  generarToken(data: TokenData): string {
    const token = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return this.toBase64Url(token);
  }

  desencriptarToken(token: string): TokenData | null {
    try {
      const base64Token = this.fromBase64Url(token);

      const bytes = CryptoJS.AES.decrypt(base64Token, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error desencriptando el token:', error);
      return null;
    }
  }

  private toBase64Url(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private fromBase64Url(base64Url: string): string {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return base64;
  }
}
