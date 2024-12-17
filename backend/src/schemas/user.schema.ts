import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Email is not valid'],
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    validate: [
      validator.isStrongPassword,
      'Password is not strong enough. Please provide stronger password',
    ],
    minLength: [8, 'Password should consist of at least 8 characters'],
    maxLength: [32, 'Maximum password length is 20 characters'],
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: 'Password are not same',
    },
    select: false,
  })
  passwordConfirm: string;
  @Prop({
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
    required: true,
    minLength: [2, 'Name should consist at least out of 2 characters'],
    maxLength: [16, 'Name should consist maximum out of 16 characters'],
    unique: true,
    lowercase: true,
  })
  name: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
  })
  reviews: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  let salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre(/^find/, async function (this: UserDocument, next) {
  this.populate({
    path: 'reviews',
    select: '-__v',
  });
  next();
});
