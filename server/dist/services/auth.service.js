"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const user_1 = require("../schema/user");
class AuthService {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
    }
    async register(user) {
        const hash = await this.argonhashPassword(user.password);
        console.log(hash, 'hash');
        const userDocument = new user_1.User(Object.assign(Object.assign({}, user), { password: hash }));
        const createdAt = new Date();
        console.log(Object.assign(Object.assign({}, user), { password: hash, createdAt: createdAt }), 'yooo brooow');
        return await userDocument.save();
    }
    async login(user) {
        const findUser = await user_1.User.find({ email: user.email }).exec();
        console.log(findUser, 'yoooo');
        const verifiedPassword = await this.argonverifyPassword(user.password, findUser.password);
    }
    async argonverifyPassword(password, hash) {
        return await argon2_1.default.verify(hash, password);
    }
    async argonhashPassword(password) {
        return await argon2_1.default.hash(password, {
            type: argon2_1.default.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });
    }
}
exports.default = AuthService;
