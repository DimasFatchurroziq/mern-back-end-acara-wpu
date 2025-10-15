import { Request, Response, NextFunction } from "express";
import { IReqUser } from "../interfaces/user.interface.js";
import { Category, IPaginationQuery } from "../validations/category.schema.js";
import categoryModel from "../models/category.model.js";

type CreateCategoryRequest = Request<{}, {}, Category, {}>;
type PaginationQueryRequest = Request<{}, {}, {}, IPaginationQuery>;

export const categoryController = {
    async create (req: IReqUser & CreateCategoryRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description, icon } = req.body;

            const existingCategoryByName = await categoryModel.findOne({
                name,
            });

            if (existingCategoryByName) {
                res.status(409).json({
                    message: "This name has already been used.",
                    data: null,
                });
                return;
            };

            const createCategory = await categoryModel.create({
                name,
                description,
                icon,
            });

            res.status(201).json(createCategory);
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
            ]
        } catch (error) {

        };
    },
    async findOne () {},
    async update () {},
    async delete () {},
}