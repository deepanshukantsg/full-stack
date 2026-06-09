declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
