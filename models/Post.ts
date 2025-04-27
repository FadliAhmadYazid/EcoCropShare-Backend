import mongoose, { Schema, models } from 'mongoose';

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['seed', 'harvest'],
    required: true,
  },
  exchangeType: {
    type: String,
    enum: ['barter', 'free'],
    default: 'barter',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  location: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'completed'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

// Add virtual 'id' property
postSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are included when converting to JSON
postSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Post = models.Post || mongoose.model('Post', postSchema);

export default Post;