import * as bcrypt from 'bcryptjs';
import { CreateMovieDTO } from 'src/movies/dtos/createMovieDTO.dto';

export const checkPassword = async (
  candidatePassword: string,
  password: string,
) => {
  return await bcrypt.compare(candidatePassword, password);
};
