import mongoose, { Schema, models } from 'mongoose';

const conversationSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: {
    type: String,
    default: '',
  },
  lastMessageDate: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
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
conversationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Pre-save middleware to update the updatedAt field
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Ensure virtual fields are included when converting to JSON
conversationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Conversation = models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;