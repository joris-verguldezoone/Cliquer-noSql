import dotenv from 'dotenv';
import{ MongoClient } from 'mongodb'
import mongoose from 'mongoose';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../', '.env')}) // config démoniaque pour docker
// console.log(dotenv.config({ path: path.resolve(__dirname, '../../../../', '.env')}))

class mongoDBClient{

    private username:string | undefined
    private password:string | undefined
    private port:string | undefined
    public client: MongoClient | undefined
    private uri:string | undefined
    private dbName: string | undefined

    constructor(){
         this.mongoInit()
    }

    private async mongoInit(){
        this.username = process.env.MONGO_INITDB_ROOT_USERNAME ?? 'bad username for mongoose';
        this.password = process.env.MONGO_INITDB_ROOT_PASSWORD ?? 'bad password for mongoose';
        this.uri = process.env.ADDRESS ?? 'bad address ip for mongoose'
        this.port = process.env.PORT ?? 'bad port for mongoose';
        this.dbName = process.env.DB_NAME ?? 'bad db name for mongoose'
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        console.log('Address:', this.uri);
        console.log('Port:', this.port);
      

        const urlString = `${process.env.URI}${this.username}:${this.password}@${this.uri}:${this.port}`;
        
        console.log(urlString)
        mongoose.connect(urlString)
            .then(() => console.log('Mongoose connected'))
            .catch((err) => console.error('Mongoose connection error', err));
        // this.client = new MongoClient(urlString);
        // this.client.db("clicker");
        // await this.client.connect()
        console.log('connected');

    }

    public get getClient():any {
        if(!this.client){
            throw new Error('MongoClient is not initialized');
        }
        return this.client;
    }

    public getCollection(value:string){
        if(!this.client?.db('clicker').collection(value)){
            throw new Error('MongoClient collection does not exist');
        }
        return this.client?.db('clicker').collection(value)
    }
}

export default mongoDBClient;