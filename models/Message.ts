import mongoose, { Schema, models } from 'mongoose';

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
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
messageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are included when converting to JSON
messageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Message = models.Message || mongoose.model('Message', messageSchema);
export default Message;