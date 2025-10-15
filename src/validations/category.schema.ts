import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().min(1),
});
export type Category = z.infer<typeof createCategorySchema>;

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive('Page must be a positive integer').default(1),
    limit: z.coerce.number().int().positive('Limit must be a positive integer').default(10),
    search: z.string().optional(),
});
export type IPaginationQuery = z.infer<typeof paginationQuerySchema>;

