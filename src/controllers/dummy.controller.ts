import { Request, Response, NextFunction } from "express";

const dummyController = {
    async dummy(req: Request, res: Response, next: NextFunction) : Promise<void> {
        res.status(200).json({
            message: "success",
            data: "ok",
        })
    }
}

export default dummyController;