import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

// Define SECRET KEY
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware for Authentication
const contextFunction = async ({ req, res }: { req: express.Request; res: express.Response }) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.log("Invalid token");
    }
  }

  return { user, res, generateToken: (data: any) => jwt.sign(data, SECRET_KEY, { expiresIn: "7d" }) };
};

// Start Apollo Server
const startServer = async () => {

 

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server, { context: contextFunction }));

  app.listen(4000, () => console.log("🚀 Server ready at http://localhost:4000/graphql"));
};

startServer()
  .then(() => {
    console.log("Server successfully started!");
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
