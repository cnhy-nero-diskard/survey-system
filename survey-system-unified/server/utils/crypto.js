// utils/crypto.js
import CryptoJS from 'crypto-js';
import { env } from '../config/env.js';

const SECRET_KEY = env.CRYPTO_SECRET;

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
