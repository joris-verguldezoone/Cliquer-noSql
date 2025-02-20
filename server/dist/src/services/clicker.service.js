"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const click_1 = require("../schema/click");
class ClickerService {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        // this.mongoClient = mongoClient.getClient
    }
    async addClicks(data) {
        const findClicker = await click_1.Clicker.findOneAndUpdate({ user: data.user }, Object.assign({}, data), // Mise à jour avec un objet incomplet
        { new: true }).exec();
        // const userDocument = new Clicker({});
        // const createdAt = new Date()
        // console.log({...user,password: hash, createdAt: createdAt, // Ajoute la date actuelle
        // },'yooo brooow')
        // return await userDocument.save(); 
        // }
        console.log(findClicker, 'schema log');
        // Insert the defined document into the "haiku" collection
        // const result = await clickerCollection.insertOne(doc);
        return findClicker;
    }
}
exports.default = ClickerService;
