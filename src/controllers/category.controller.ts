import { Request, Response, NextFunction } from "express";
import { IReqUser } from "../interfaces/user.interface.js";
import { Category, IPaginationQuery } from "../validations/category.schema.js";
import categoryModel from "../models/category.model.js";
import { apiResponse } from "../helpers/apiResponse.js";
import { apiError } from "../helpers/apiError.js";

type CreateCategoryRequest = Request<{}, {}, Category, {}>;
type PaginationQueryRequest = Request<{}, {}, {}, IPaginationQuery>;

export const categoryController = {
    async create (req: IReqUser & CreateCategoryRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description, icon } = req.body;

            const existingCategoryByName = await categoryModel.findOne({
                name,
            });

            if (existingCategoryByName) throw apiError.conflict("This category name has already been used.");

            const createCategory = await categoryModel.create({
                name,
                description,
                icon,
            });

            apiResponse.created(res, createCategory, "Category created successfully.");
            return;
            
        } catch (error) {
            next(error);
        };
    },

    async findAll (req: IReqUser & PaginationQueryRequest, res: Response, next: NextFunction): Promise<void> {
        const { page, limit, search } = req.query; 
        try {
            const query: any = {};

            query.$or = [
                { name: { $regex: search, $options: 'i' }},
                { description: { $regex: search, $options: 'i' }},
            ];

            const skip = ( page - 1 ) * limit;

            const [ result, count ] = await Promise.all([
                categoryModel.find(query)
                    .limit(limit)
                    .skip(skip)
                    .sort({ createdAt: -1 })
                    .exec(),
                categoryModel.countDocuments(query),
            ]);

        } catch (error) {

        };
    },
    async findOne () {},
    async update () {},
    async delete () {},
}