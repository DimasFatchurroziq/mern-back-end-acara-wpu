import mongoose from "mongoose";
import { Category } from "../validations/category.schema.js";

const Schema = mongoose.Schema;

const CategorySchema = new Schema<Category>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    icon: {
        type: Schema.Types.String,
        required: true,
    }
},
{
    timestamps: true,
});

const categoryModel = mongoose.model('Category', CategorySchema);

export default categoryModel;