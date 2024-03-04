import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
export class Password {
  /**
   * Hashes a given password string
   * And returns hashed password + salt
   *
   * @static
   * @param {string} password
   * @return {string}
   * @memberof Password
   */
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  /**
   * Compares the given password to the DB stored password
   * Retuns a boolean
   *
   * @static
   * @param {string} storedPassword
   * @param {string} suppliedPassword
   * @return {*}
   * @memberof Password
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
