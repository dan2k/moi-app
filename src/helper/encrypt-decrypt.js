/* import * as CryptoJS from 'crypto-js';
import * as SecureStorage from 'secure-web-storage';
//https://www.npmjs.com/package/secure-web-storage
export default function useSecure(){
     const SECRET_KEY = import.meta.env.VITE_PRIVATE_TOKEN_KEY;
     // const secureStorage = new SecureStorage(localStorage, {
     const secureStorage = new SecureStorage(sessionStorage, {
          hash: function hash(key) {
              key = CryptoJS.SHA256(key, SECRET_KEY);
       
              return key.toString();
          },
          encrypt: function encrypt(data) {
              data = CryptoJS.AES.encrypt(data, SECRET_KEY);
              data = data.toString();
              return data;
          },
          decrypt: function decrypt(data) {
              data = CryptoJS.AES.decrypt(data, SECRET_KEY);
       
              data = data.toString(CryptoJS.enc.Utf8);
       
              return data;
          }
      });
     return { secureStorage }
}
   */