import argon2 from 'argon2'
import { IUser, User } from '../schema/user';
import mongoDBClient from '../config/mongoDBClient';
import ILogin from '../interfaces/auth.interface';
import jwt, { Secret } from 'jsonwebtoken'
import { decode } from 'punycode';
import { Clicker } from '../schema/click';

export default class AuthService {

    constructor(private mongoClient: mongoDBClient){
    }

    async register(user: Omit<IUser, '_id' | 'createdAt'>) : Promise<IUser> {
        
        const hash = await this.argonhashPassword(user.password)
        console.log(hash,'hash')
        const userDocument = new User({...user,password: hash});
        const createdAt = new Date()
        
        console.log({...user,password: hash, createdAt: createdAt, // Ajoute la date actuelle
        },'yooo brooow')


        
        const newUser = await userDocument.save(); 


        const clickerDocument = new Clicker({
            user: newUser._id, // Référence vers User
            click_sum: 0,
            upgrades: {
              click_rentability: 
                {   level: 0,
                    level_max: 0,
                },
              crits: {
                crit_chance: 
                {   level: 0,
                    level_max: 0,
                },
                crit_multiplier: 
                {   level: 0,
                    level_max: 0
                }
              },
              click_per_seconds: 
                {     level: 0,
                    level_max: 0
                }
            }
        });

        const newClick = await clickerDocument.save(); 

        return newUser

    }

    async login(user: ILogin): Promise<any>{

        const findUser = await User.findOne({email: user.email}).exec();


        if (findUser == null ){
            throw new Error("L'utilisation n'existe pas")
        }

        console.log(findUser,'yoooo')

        const verifiedPassword = await this.argonverifyPassword(user.password, findUser.password)

        if(verifiedPassword){
            const secret: Secret | undefined = process.env.JWT_SECRET 
            if(secret != undefined){

                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data:  findUser
                }, secret);
                
                return token
            } 
        }

    }

    private async argonverifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }

    private async argonhashPassword(password: string): Promise<string> {
        return await argon2.hash(password, {
            type: argon2.argon2id, 
            memoryCost: 2 ** 16,     
            timeCost: 3,             
            parallelism: 1          
        });
    }

    async verifyJwt(token:any) :Promise<string | jwt.JwtPayload>{
        console.log(token,'what is the token ? ')
        if (!token) {
            return { message: 'Access denied' };
        }
    
        const secret = process.env.JWT_SECRET
        console.log(secret,'secret, eeeee')
        if(secret != undefined){
            try {
                
                const decoded = jwt.verify(token, secret)
                console.log(decoded, 'yoooo?')
                return decoded
            } catch (error) {
                console.log(error,'error jwt')
                return 'invalid Token'
            }
        }
        
        return {message: 'Problème de vérification'}
      
    }
}
