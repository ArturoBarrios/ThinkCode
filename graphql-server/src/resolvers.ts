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
    // New Mutation: analyzeProblem
    analyzeProblem: async (
      _: any,
      { problemText }: { problemText: string },
      context: any
    ) => {
            // Construct the prompt for OpenAI
            const prompt = `
      You are an expert algorithm tutor. Analyze the following LeetCode problem description and provide:
      1. An estimate of the runtime complexity.
      2. An estimate of the space complexity.
      3. Common algorithms or data structures that might solve this problem.
      4. One or two similar problems that share the same core idea.
      5. A few hints or ideas to help solve the problem.

      LeetCode Problem:
      ${problemText}
            `;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4", // or "gpt-4o" if that's the correct model identifier
          messages: [{ role: "user", content: prompt }],
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
        });

        const analysis =
          completion.choices[0].message?.content || "No analysis provided.";
        
        // Optionally, you could store this analysis in your database via Prisma here

        return analysis;
      } catch (error) {
        console.error("Error in analyzeProblem mutation:", error);
        throw new Error("Analysis failed.");
      }
    },
  },
};
