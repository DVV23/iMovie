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
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: [true, 'Title is required'],
  })
  title: string;
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
  genre: string[];
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
    type: [mongoose.Types.ObjectId],
    ref: 'Review',
  })
  reviews: mongoose.Types.ObjectId[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.pre('save', async function (next) {
  this.updatedAt = new Date().toISOString();
  next();
});
// MovieSchema.pre(/^find/, async function (this: MovieDocument, next) {
//   this.select('-__v');
//   next();
// });
// MovieSchema.pre(/^find/, async function (this: MovieDocument, next) {
//   // const query = this as Query<MovieDocument, Movie>;
//   // query.populate({
//   //   path: 'reviews',
//   //   select: '-__v',
//   // });
//   // next();
//   this.populate({
//     path: 'reviews',
//     select: '-__v ',
//   });
//   next();
// });
