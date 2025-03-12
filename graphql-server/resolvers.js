"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const prismaClient_1 = __importDefault(require("./db/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const openai_1 = __importDefault(require("openai"));
// Initialize OpenAI using your API key from environment variables
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || "",
});
exports.resolvers = {
    Query: {
        users: async () => await prismaClient_1.default.user.findMany(),
        user: async (_, { username }) => await prismaClient_1.default.user.findUnique({ where: { username } }),
        me: async (_, __, context) => {
            if (!context.user)
                throw new Error("Not authenticated");
            return await prismaClient_1.default.user.findUnique({ where: { username: context.user.username } });
        },
    },
    Mutation: {
        signup: async (_, { username, password }) => {
            console.log("[SIGNUP] Received signup request for:", username);
            const existingUser = await prismaClient_1.default.user.findUnique({ where: { username } });
            if (existingUser) {
                console.log("[SIGNUP] User already exists:", username);
                throw new Error("User already exists");
            }
            console.log("[SIGNUP] Hashing password for:", username);
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            console.log("[SIGNUP] Creating new user in the database...");
            const newUser = await prismaClient_1.default.user.create({
                data: { username, password: hashedPassword },
            });
            console.log("[SIGNUP] New user created:", newUser);
            return { id: newUser.id, username: newUser.username };
        },
        login: async (_, { username, password }, context) => {
            const user = await prismaClient_1.default.user.findUnique({ where: { username } });
            if (!user || !(await bcrypt_1.default.compare(password, user.password)))
                throw new Error("Invalid credentials");
            const token = context.generateToken({ username });
            context.res.cookie("token", token, {
                httpOnly: true,
                secure: false, // Change to true in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return true;
        },
        logout: (_, __, context) => {
            context.res.clearCookie("token");
            return true;
        },
        // New Mutation: analyzeProblem
        analyzeProblem: (_, { problemText }) => {
            // Implement your problem analysis logic here
            return `Analysis result for: ${problemText}`;
        },
    },
};
