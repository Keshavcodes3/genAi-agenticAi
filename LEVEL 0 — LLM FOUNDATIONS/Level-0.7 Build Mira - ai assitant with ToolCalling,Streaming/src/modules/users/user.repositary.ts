import { UserModel } from "./user.model.js";
import type {
    CreateUserInput,
} from "./user.types.js";

class UserRepository {
    async create(data: CreateUserInput) {
        return UserModel.create(data);
    }

    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async findByEmailWithPassword(email: string) {
        return UserModel
            .findOne({ email })
            .select("+password");
    }

    async findById(id: string) {
        return UserModel.findById(id);
    }

    async updateLastLogin(id: string) {
        return UserModel.findByIdAndUpdate(
            id,
            {
                lastLoginAt: new Date(),
            },
            {
                new: true,
            }
        );
    }
}

export const userRepository = new UserRepository();