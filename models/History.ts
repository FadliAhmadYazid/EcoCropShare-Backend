import mongoose, { Schema, models } from 'mongoose';

const historySchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plantName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  type: {
    type: String,
    enum: ['post', 'request'],
    required: true,
  }
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
historySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are included when converting to JSON
historySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const History = models.History || mongoose.model('History', historySchema);

export default History;