import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

// interface IReview {
//   user: mongoose.ObjectId;
//   rating: number;
//   comment: string;
//   createdAt: Date;
// }

@Schema()
export class Movie {
  @Prop({
    type: String,
    required: [true, 'Title is required'],
  })
  title: String;
  @Prop({
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Minimal length is 10 symbols'],
    maxlength: [300, 'Maximum length is 255 symbols'],
  })
  description: String;
  @Prop({
    type: [String],
    required: true,
  })
  genre: String[];
  @Prop({
    type: Number,
    required: true,
  })
  duration: Number;
  @Prop({
    type: String,
  })
  director: string;

  @Prop({
    type: [String],
  })
  cast: string[];

  @Prop({
    type: String,
    required: true,
  })
  createdAt: string;
  @Prop({
    type: [String],
    required: true,
  })
  language: string[];

  @Prop({
    type: Object,
  })
  ratings: {
    averageRating: { type: Number };
    ratingCount: { type: Number; default: 0 };
  };

  //   @Prop()
  //   reviews: IReview[];

  @Prop({
    type: Date,
    required: true,
  })
  releaseDate: Date;

  @Prop({
    type: String,
  })
  updatedAt: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
  })
  reviews: mongoose.Schema.Types.ObjectId[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.pre('save', async function (next) {
  this.updatedAt = new Date().toISOString();
  next();
});
