import prisma from "../db/prismaClient";


import bcrypt from "bcrypt";
import OpenAI from "openai";

// Initialize OpenAI using your API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });

export const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (_: any, { username }: { username: string }) => 
      await prisma.user.findUnique({ where: { username } }),
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { username: context.user.username } });
    },
  },
  Mutation: {
    signup: async (_: any, { username, password }: { username: string; password: string }) => {
        console.log("[SIGNUP] Received signup request for:", username);
        
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
          console.log("[SIGNUP] User already exists:", username);
          throw new Error("User already exists");
        }
      
        console.log("[SIGNUP] Hashing password for:", username);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("[SIGNUP] Creating new user in the database...");
        const newUser = await prisma.user.create({
          data: { username, password: hashedPassword },
        });
        
        console.log("[SIGNUP] New user created:", newUser);
        return { id: newUser.id, username: newUser.username };
      },
      
    login: async (_: any, { username, password }: { username: string; password: string }, context: any) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");

      const token = context.generateToken({ username });

      context.res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Change to true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return true;
    },
    logout: (_: any, __: any, context: any) => {
      context.res.clearCookie("token");
      return true;
    },
    // New Mutation: analyzeProblem
    analyzeProblem: (_: any, { problemText }: { problemText: string }) => {
        // Implement your problem analysis logic here
        return `Analysis result for: ${problemText}`;
      },
  },
};
