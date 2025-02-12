import z from "zod";
export const signupInput = z.object({
    email: z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})

export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})

export const createBlogInput = z.object({
    title:z.string(),
    content : z.string()
})

export const updateBlogInput = z.object({
    title:z.string(),
    content : z.string(),
    id : z.string()
})
export type updateBlogInputBlogInput = z.infer<typeof updateBlogInput>
export type signupInput = z.infer<typeof signupInput>
export type signinInput = z.infer<typeof signinInput>
export type createBlogInput = z.infer<typeof createBlogInput>