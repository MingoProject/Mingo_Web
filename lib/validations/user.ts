import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
  phone: z.string().min(3).max(10),
  birthday: z.string().min(3).max(1000),
  gender: z.string().min(3).max(1000),
});
