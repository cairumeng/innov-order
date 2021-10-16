const bcrypt = require('bcrypt');

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (
  password: string,
  cryptedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, cryptedPassword);
};
