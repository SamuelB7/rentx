import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { AppError } from "../../../../shared/errors/AppError";

interface IRequest {
    email: string
    password: string
}

interface IResponse {
    user: {
        name: string,
        email: string
    },
    token: string
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){} 

    async excute({email, password}: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email)
        if(!user) {
            throw new AppError("Email or password incorrect!")
        }

        const passwordMatch = await compare(password, user.password)
        if(!passwordMatch) {
            throw new AppError("Email or password incorrect!")
        }
        
        const token = sign({}, "69c6e4a394b794ac45a4ca63761bff01", {
            subject: user.id,
            expiresIn: "1d"
        })

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email
            }
        }

        return tokenReturn
    }
}

export { AuthenticateUserUseCase }