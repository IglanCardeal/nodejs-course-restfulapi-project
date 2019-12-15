import mongoose from "mongoose";

const { Schema } = mongoose;

const Posts = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true
    }
  },
  { timestamps: true } // If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
);

export default mongoose.model("Post", Posts);
