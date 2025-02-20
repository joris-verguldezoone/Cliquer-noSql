"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClickerService {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        // this.mongoClient = mongoClient.getClient
    }
    async incrementClick(schema) {
        const clickerCollection = this.mongoClient.getCollection('click');
        // Create a document to insert
        const newClick = {};
        // Insert the defined document into the "haiku" collection
        // const result = await clickerCollection.insertOne(doc);
    }
}
exports.default = ClickerService;
