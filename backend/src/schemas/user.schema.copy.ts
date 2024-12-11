import { Schema, Document } from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcryptjs';
export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Email should be valid'],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: [
      validator.isStrongPassword,
      'Password is not strong enough. Please provide stronger password',
    ],
    minLength: [8, 'Password should consist of at least 8 characters'],
    maxLength: [32, 'Maximum password length is 20 characters'],
    select: false,
  },
  //   confirmPassword: {
  //     type: String,
  //     required: true,
  //     validate: {
  //       validator: function (el: string) {
  //         return el === this.password;
  //       },
  //       message: 'Passwords are not the same!',
  //     },
  //     select: false,
  //   },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  name: {
    type: String,
    required: true,
    minLength: [2, 'Name should consist at least out of 2 characters'],
    maxLength: [16, 'Name should consist maximum out of 16 characters'],
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  let salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  //   this.confirmPassword = undefined;
  next();
});

export interface User extends Document {
  id: string;
  email: string;
  password: string;
  //   confirmPassword: string;
  name: string;
  role?: string;
}
