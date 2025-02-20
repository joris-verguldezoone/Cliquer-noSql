"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../', '.env') }); // config démoniaque pour docker
class mongoDBClient {
    constructor() {
        this.mongoInit();
    }
    async mongoInit() {
        var _a, _b, _c, _d, _e;
        this.username = (_a = process.env.MONGO_INITDB_ROOT_USERNAME) !== null && _a !== void 0 ? _a : 'bad username for mongoose';
        this.password = (_b = process.env.MONGO_INITDB_ROOT_PASSWORD) !== null && _b !== void 0 ? _b : 'bad password for mongoose';
        this.uri = (_c = process.env.ADDRESS) !== null && _c !== void 0 ? _c : 'bad address ip for mongoose';
        this.port = (_d = process.env.PORT) !== null && _d !== void 0 ? _d : 'bad port for mongoose';
        this.dbName = (_e = process.env.DB_NAME) !== null && _e !== void 0 ? _e : 'bad db name for mongoose';
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        console.log('Address:', this.uri);
        console.log('Port:', this.port);
        const urlString = `${process.env.URI}${this.username}:${this.password}@${this.uri}:${this.port}`;
        console.log(urlString);
        mongoose_1.default.connect(urlString)
            .then(() => console.log('Mongoose connected'))
            .catch((err) => console.error('Mongoose connection error', err));
        // this.client = new MongoClient(urlString);
        // this.client.db("clicker");
        // await this.client.connect()
        console.log('connected');
    }
    get getClient() {
        if (!this.client) {
            throw new Error('MongoClient is not initialized');
        }
        return this.client;
    }
    getCollection(value) {
        var _a, _b;
        if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.db('clicker').collection(value))) {
            throw new Error('MongoClient collection does not exist');
        }
        return (_b = this.client) === null || _b === void 0 ? void 0 : _b.db('clicker').collection(value);
    }
}
exports.default = mongoDBClient;
