import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Full Stack App API",
      version: "1.0.0",
      description: "REST API with Express + TypeORM",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@example.com" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateUserBody: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        UpdateUserBody: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@example.com" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "User not found" },
          },
        },
        UpdateUserSkillBody: {
          type: "object",
          required: ["skill"],
          properties: {
            skill: {
              type: "string",
              enum: ["Backend", "Frontend", "Designer", "PM"],
              example: "Backend",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
