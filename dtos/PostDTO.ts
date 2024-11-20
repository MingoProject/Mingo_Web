import { Schema } from "mongoose";

export interface PostCreateDTO {
  content: string;
  media?: string[];
  url?: string;
  location?: string;
  privacy?: {
    type: string;
    allowedUsers?: Schema.Types.ObjectId[];
  };
}

export interface PostResponseDTO {
  _id: string;
  content: string;
  media?: string[];
  url?: string;
  createdAt: Date;
  author: Schema.Types.ObjectId;
  shares: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  location?: string;
  privacy: {
    type: string;
    allowedUsers?: Schema.Types.ObjectId[];
  };
  likedIds: Schema.Types.ObjectId[];
  flag: boolean;
}
