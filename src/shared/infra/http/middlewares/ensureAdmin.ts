import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";


export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.user

        const usersRepository = new UsersRepository()

        const user = await usersRepository.findById(id)
        
        if(user.isAdmin == false) {
            throw new AppError("User is not an admin!");
        }
    } catch (AppError) {
        return response.status(AppError.statusCode).json(AppError.message)
    }

    return next()
}