import * as z from "zod";

export const PostsSchema = z.object({
  caption: z.string().optional(),
  author: z.string().nonempty("Author is required"),
  tags: z.array(z.string()).optional(),
});
