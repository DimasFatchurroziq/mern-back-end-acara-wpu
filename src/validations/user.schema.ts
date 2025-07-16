import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string().min(1, "Full name is required"), 
    username: z.string().min(1, "Username is required"), 
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"), 
    confirmPassword: z.string().min(1, "Confirm password is required") 
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  password: z.string().min(6),
}).and(
  z.union([
    z.object({ email: z.string().email() }),
    z.object({ username: z.string().min(3) })
  ])
);

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const activateUserSchema = z.object({
  code: z.string().min(1, "Activation code is required.")
    .regex(/^[a-fA-F0-9]{128}$/, "Invalid activation code format.")
});

export type ActivateUserInput = z.infer<typeof activateUserSchema>;

// export const userIdParamsSchema = z.object({
//   userId: z.string().length(24, "Invalid MongoDB ObjectId"),
// });

// export const querySchema = z.object({
//   search: z.string().optional(),
// });