import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;
@Schema()
export class Review {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    minlength: [2, 'Review should consist at least minimum of 2 symbols'],
    maxlength: [1000, 'Review should consist maximum of 1000 symbols'],
  })
  review: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'A review should belong to Movie'],
  })
  forMovie: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review should belong to User'],
  })
  createdByUser: mongoose.Schema.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, async function (this: ReviewDocument, next) {
  this.populate({
    path: 'forMovie',
  });
  this.populate({
    path: 'createdByUser',
    select: '-__v',
  });
  next();
});
