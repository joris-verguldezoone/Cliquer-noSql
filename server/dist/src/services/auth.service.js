"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const user_1 = require("../schema/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const click_1 = require("../schema/click");
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
        const newUser = await userDocument.save();
        const clickerDocument = new click_1.Clicker({
            user: newUser._id, // Référence vers User
            click_sum: 0,
            upgrades: {
                click_rentability: { level: 0,
                    level_max: 0,
                },
                crits: {
                    crit_chance: { level: 0,
                        level_max: 0,
                    },
                    crit_multiplier: { level: 0,
                        level_max: 0
                    }
                },
                click_per_seconds: { level: 0,
                    level_max: 0
                }
            }
        });
        const newClick = await clickerDocument.save();
        return newUser;
    }
    async login(user) {
        const findUser = await user_1.User.findOne({ email: user.email }).exec();
        if (findUser == null) {
            throw new Error("L'utilisation n'existe pas");
        }
        console.log(findUser, 'yoooo');
        const verifiedPassword = await this.argonverifyPassword(user.password, findUser.password);
        if (verifiedPassword) {
            const secret = process.env.JWT_SECRET;
            if (secret != undefined) {
                const token = jsonwebtoken_1.default.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: findUser
                }, secret);
                return token;
            }
        }
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
    async verifyJwt(token) {
        console.log(token, 'what is the token ? ');
        if (!token) {
            return { message: 'Access denied' };
        }
        const secret = process.env.JWT_SECRET;
        console.log(secret, 'secret, eeeee');
        if (secret != undefined) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                console.log(decoded, 'yoooo?');
                return decoded;
            }
            catch (error) {
                console.log(error, 'error jwt');
                return 'invalid Token';
            }
        }
        return { message: 'Problème de vérification' };
    }
}
exports.default = AuthService;
