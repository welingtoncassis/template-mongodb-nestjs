import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ unique: true, required: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  validatePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret.password;
  },
});

UserSchema.pre('save', preSave);

const SALT_WORK_FACTOR = 10;
export async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  // generate a salt
  return new Promise<void>((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: any) => {
      if (err) {
        return reject(err);
      }
      // hash the password along with our new salt
      bcrypt.hash(this.password, salt, (_err: any, hash: any) => {
        if (_err) {
          return reject(_err);
        }
        this.password = hash;
        return resolve();
      });
    });
  });
}
