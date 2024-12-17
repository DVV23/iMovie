import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Movie } from './movies.schema';

export type ReviewDocument = HydratedDocument<Review>;
@Schema()
class Review {
  @Prop({
    type: String,
    required: true,
    minlength: [2, 'Review should consist at least minimum of 2 symbols'],
    maxlength: [2, 'Review should consist maximum of 255 symbols'],
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
