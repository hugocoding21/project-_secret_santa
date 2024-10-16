const mongoose = require("mongoose");
const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
