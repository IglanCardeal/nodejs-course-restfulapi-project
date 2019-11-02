import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'I am a new user!'
    },
    posts: [
      {
        // Array de id's que referencia a documentos na collection 'Posts'.
        type: Schema.Types.ObjectId, 
        ref: "Post"
      }
    ]
  },
  { timestamp: true }
);

export default mongoose.model("User", User);
