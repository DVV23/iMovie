import * as bcrypt from 'bcryptjs';

export const checkPassword = async (
  candidatePassword: string,
  password: string,
) => {
  return await bcrypt.compare(candidatePassword, password);
};
