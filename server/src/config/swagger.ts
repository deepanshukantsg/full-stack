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
        Task: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Build login page" },
            description: { type: "string", example: "Implement auth UI" },
            status: {
              type: "string",
              enum: ["To Do", "In Progress", "Code Review", "PR Review", "Dev Complete"],
              example: "To Do",
            },
            priority: {
              type: "string",
              enum: ["Low", "Medium", "High", "HIGHEST"],
              example: "Medium",
            },
            dueDate: { type: "string", format: "date", example: "2026-07-01", nullable: true },
            developerId: { type: "integer", example: 3, nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateTaskBody: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", example: "Build login page" },
            description: { type: "string", example: "Implement auth UI" },
            status: {
              type: "string",
              enum: ["To Do", "In Progress", "Code Review", "PR Review", "Dev Complete"],
            },
            priority: {
              type: "string",
              enum: ["Low", "Medium", "High", "HIGHEST"],
            },
            dueDate: { type: "string", format: "date", example: "2026-07-01" },
            developerId: { type: "integer", example: 3 },
          },
        },
        UpdateTaskBody: {
          type: "object",
          properties: {
            title: { type: "string", example: "Build login page" },
            description: { type: "string", example: "Implement auth UI" },
            status: {
              type: "string",
              enum: ["To Do", "In Progress", "Code Review", "PR Review", "Dev Complete"],
            },
            priority: {
              type: "string",
              enum: ["Low", "Medium", "High", "HIGHEST"],
            },
            dueDate: { type: "string", format: "date", example: "2026-07-01" },
            developerId: { type: "integer", example: 3 },
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
