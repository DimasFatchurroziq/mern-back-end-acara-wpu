// src/docs/swagger.ts (atau nama file konfigurasi swagger-autogen Anda)
console.log("--- Executing swagger.ts ---"); 
import swaggerAutogen from "swagger-autogen";
import path from 'path';
import { fileURLToPath } from 'url'; // For ESM to get __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = "./swagger_output.json";
console.log("Current __dirname (swagger.ts location):", __dirname);

// Pastikan path ini benar relatif terhadap lokasi file swagger.ts ini
// Jika swagger.ts ada di src/docs/, dan route di src/routes/, maka:
// const endpointsFiles = ["../routes/api.route.ts"]; // Ini masih diperlukan untuk mendeteksi path dan method
const endpointsFiles = [path.resolve(__dirname, '../routes/api.route.ts')];
console.log("Resolved endpointsFiles path for swagger-autogen:", endpointsFiles[0]);
const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API ACARA",
        description: "Dokumentasi API ACARA",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://mern-back-end-acara-wpu.vercel.app/api",
            description: "Deploy Server",
        },
    ],
    paths: { // <-- BAGIAN BARU: Anda akan mendefinisikan PATHS di sini
        "/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "Register a new user (Defined in swagger.ts)",
                description: "Endpoint untuk mendaftarkan pengguna baru.",
                requestBody: { // <-- DEFINISI REQUEST BODY LANGSUNG DI SINI
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                // Anda bisa mendefinisikan skema langsung di sini
                                type: "object",
                                properties: {
                                    fullName: { type: "string", example: "John Doe" },
                                    username: { type: "string", example: "johndoe" },
                                    email: { type: "string", format: "email", example: "john.doe@example.com" },
                                    password: { type: "string", format: "password", minLength: 8, example: "securePassword123" },
                                    confirmPassword: { type: "string", format: "password", example: "securePassword123" }
                                },
                                required: ["fullName", "username", "email", "password", "confirmPassword"]
                            }
                            // Atau Anda bisa tetap menggunakan $ref jika skema ini juga digunakan di tempat lain:
                            // $ref: '#/components/schemas/RegisterRequest'
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "User registered successfully!" },
                                        data: { type: "object" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Invalid input or validation error" },
                    "409": { description: "Email or username already exists" }
                }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "Log in a user (Defined in swagger.ts)",
                description: "Endpoint untuk login pengguna.",
                requestBody: { // <-- DEFINISI REQUEST BODY LANGSUNG DI SINI
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                // Anda bisa mendefinisikan skema langsung di sini
                                type: "object",
                                properties: {
                                    identifier: { type: "string", example: "user1@gmail.com" },
                                    password: { type: "string", format: "password", example: "usercoba1" }
                                },
                                required: ["identifier", "password"]
                            }
                            // Atau Anda bisa tetap menggunakan $ref jika skema ini juga digunakan di tempat lain:
                            // $ref: '#/components/schemas/LoginRequest'
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "Login success" },
                                        data: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized - Invalid credentials" }
                }
            }
        },
        "/auth/me": {
            get: {
                tags: ["Authentication"],
                summary: "Get current authenticated user's data (Defined in swagger.ts)",
                description: "Mengambil data profil pengguna yang sedang login.",
                security: [
                    { bearerAuth: [] }
                ],
                responses: {
                    "200": {
                        description: "User data retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string", example: "654321abcdef" },
                                        username: { type: "string", example: "johndoe" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        // Anda bisa HAPUS LoginRequest dan RegisterRequest dari sini
        // jika Anda mendefinisikannya langsung di `paths` di atas.
        // Namun, jika Anda ingin skema ini dapat digunakan kembali,
        // lebih baik tetap mendefinisikannya di sini dan mereferensikannya dengan $ref.
        schemas: {
            // Contoh jika Anda tetap ingin menggunakan $ref dari path
            // LoginRequest: { /* definisi LoginRequest */ },
            // RegisterRequest: { /* definisi RegisterRequest */ }
        }
    }
};

// console.log("Doc object structure before generation:", JSON.stringify(doc, null, 2));
console.log("Doc object structure before generation (paths keys):", Object.keys(doc.paths)); // Untuk verifikasi
console.log("Doc object has /auth/register post with requestBody:", !!doc.paths["/auth/register"]?.post?.requestBody); 

swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointsFiles, doc);

console.log("--- Swagger generation complete ---");