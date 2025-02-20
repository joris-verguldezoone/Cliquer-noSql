import mongoDBClient from '../config/mongoDBClient';
import { IClicker, Clicker } from '../schema/click';


class ClickerService {
    constructor(private mongoClient: mongoDBClient){
        // this.mongoClient = mongoClient.getClient
    }

    async addClicks(data: IClicker){

        const findClicker = await Clicker.findOneAndUpdate(
            { user: data.user },  // Filtre
            { ...data },  // Mise à jour avec un objet incomplet
            { new: true } 
        ).exec();
       
        // const userDocument = new Clicker({});
        // const createdAt = new Date()
        
        // console.log({...user,password: hash, createdAt: createdAt, // Ajoute la date actuelle
        // },'yooo brooow')
        // return await userDocument.save(); 

        // }

        console.log(findClicker,'schema log')

        // Insert the defined document into the "haiku" collection
        // const result = await clickerCollection.insertOne(doc);
        return findClicker
    }

}

export default ClickerService;