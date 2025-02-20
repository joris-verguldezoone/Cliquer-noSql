import Fastify, { FastifyInstance } from 'fastify';
import mongoDBClient from './src/config/mongoDBClient';  // Ton client MongoDB personnalisé
import ClickerService from './src/services/clicker.service';
import AuthService from './src/services/auth.service';
import { IUser } from './src/schema/user';
import  ILogin  from './src/interfaces/auth.interface'
import { IClicker } from './src/schema/click';
import cors from '@fastify/cors';
import cookie from "@fastify/cookie";



// import dotenv from 'dotenv';
// dotenv.config();
// Étendre l'interface Fastify pour inclure `clickerService`
declare module 'fastify' {
    interface FastifyInstance {
      clickerService: ClickerService;
      authService: AuthService
    }
  }

  
// Instancier Fastify
const server: FastifyInstance = Fastify({ logger: true });

// Fonction pour initialiser MongoDB et créer le service
async function initMongoDB() {
  const mongoClient = new mongoDBClient();
  try {
    const clickerService = new ClickerService(mongoClient);
    const authService = new AuthService(mongoClient);

    return {clickerService: clickerService, authService: authService}; // Retourner le service après l'initialisation
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    throw new Error('Impossible de connecter MongoDB');
  }
}

// Déclarer des routes
server.post('/register', async function register (request, reply) {
  const { username, password, email } = request.body as IUser
  
  if(username == undefined || password == undefined || email == undefined){
    throw new Error("Champs mal rempli")
  }

  const authService = server.authService

  // Utiliser le service de clicker depuis l'instance de Fastify
  const user = { username: username, password: password, email: email } as Omit<IUser, '_id' | 'createdAt'>
  // Par exemple, utiliser clickerService pour enregistrer l'utilisateur
  const result = await authService.register(user); 
  
  // Traiter l'inscription avec 'username'  
  console.log('Utilisateur enregistré:', result);

  // Répondre à la requête
  return { message: `Utilisateur ${username} enregistré avec succès !` };
});

server.post('/login', async function login (request, reply){
  const { email, password } = request.body as IUser
  console.log(email,password)
  if(password == undefined || email == undefined){
    throw new Error("Champs mal rempli")
  }

  const user = {email:email, password:password} as ILogin

  const authService = server.authService

  const token = await authService.login(user)

  reply.setCookie("token", token, {
    httpOnly: true, // Empêche l'accès via JavaScript (protection XSS) <3
    // secure: process.env.NODE_ENV === "production", // HTTPS en production
    sameSite: "strict", // Protection CSRF
    path: "/", // Accessible sur tout le site
    maxAge: 60 * 60 * 24 * 7, // Expire dans 7 jours
  });

  return reply.code(200).send({message: 'Connexion réussie',payload: token.data})
})

server.post('/click', async function addClicks(request, reply) {
  const authService = server.authService
  console.log(request.headers.authorization)

  const bearerToken = request.headers.authorization 
  const token = bearerToken && bearerToken.split(' ')[1]; // On récupère la deuxième partie du header

  const payload = await authService.verifyJwt(token)
  console.log(payload,'payload')

  let clicker = request.body as IClicker

  if (typeof payload === 'object' && 'data' in payload) {
    
    const userId = payload.data._id 
    // clicker.set("user", userId);
    const tonPEre = {...clicker, user: userId} as IClicker
    console.log(clicker)
  
    const clickerService = server.clickerService
  
    const result = await this.clickerService.addClicks(tonPEre)

    return reply.code(200).send(result)
  }

  return reply.code(403).send('Un probleme est survenue')

})

server.get("/me", async (request, reply) => {
  const token = request.cookies.token; // Récupère le JWT depuis le cookie

  if (!token) {
    return reply.code(401).send({ message: "Non authentifié" });
  }

  const payload = await server.authService.verifyJwt(token);
  if (typeof payload === "string") {
    return reply.code(401).send({ message: "Token invalide" });
  }

  return reply.send({ user: payload.data });
});


// Ajouter d'autres routes ici si besoin...

// Fonction pour démarrer le serveur Fastify
const start = async () => {
  try {
    // Initialiser MongoDB et ClickerService
    const services = await initMongoDB();
    server.register(import('@fastify/formbody'))

    server.register(cors, {
      origin: 'http://localhost:5173', // Autorise toutes les origines (⚠️ Modifier en production)
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
      allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
      credentials: true, // Permet l'envoi de cookies/tokens (si nécessaire)
    });

    server.register(cookie, {
      secret: process.env.COOKIE_SECRET || "supersecret", // Chiffrement des cookies (facultatif)
      hook: "onRequest",
    });
 
    // server.register(import('@fastify/json')); // Pour application/json

    // Ajouter clickerService à l'instance de Fastify
    server.decorate('clickerService', services.clickerService);  // Ajouter clickerService à Fastify pour le rendre accessible partout
    server.decorate('authService', services.authService);  // Ajouter clickerService à Fastify pour le rendre accessible partout

    // Si tout est OK, démarrer le serveur Fastify
    await server.listen({ port: 3000 });

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`Server started on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
