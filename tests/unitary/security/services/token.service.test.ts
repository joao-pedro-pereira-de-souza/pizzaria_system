import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import jwt from "jsonwebtoken";
describe("security/services/token.service", () => {
  const secret = "test_secret";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    process.env.JWT_SECURITY = secret;
  });

  describe("sign", () => {
    it("should generate a valid token", async () => {
      const { TokenService } = await import(
        "@root/src/security/services/token.service"
      );
      const token = TokenService.sign({ data: { userId: 1 }, expiresIn: "1d" });
      const decoded = jwt.verify(token, secret);
      expect(decoded).toHaveProperty("userId", 1);
    });

    it("should use default expiration if expiresIn is not provided", async () => {
      const { TokenService } = await import("@security/services/token.service");

      const token = TokenService.sign({ data: { userId: 1 } });
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      expect(decoded).toHaveProperty("exp");
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe("verify", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
      jest.unmock("jsonwebtoken");
    });

    it("should verify a valid token", async () => {
      const { TokenService } = await import("@security/services/token.service");
      const token = TokenService.sign({ data: { userId: 1 }, expiresIn: "1d" });
      const decoded = TokenService.verify(token);
      expect(decoded).toHaveProperty("userId", 1);
    });

    it('should throw "Token JWT inválido" for JsonWebTokenError', async () => {
      jest.mock("jsonwebtoken");

      const { default: instanceJwt } = await import("jsonwebtoken");

      (instanceJwt.verify as jest.Mock).mockImplementation(() => {
        throw new instanceJwt.JsonWebTokenError("Invalid token");
      });

      const { TokenService } = await import("@security/services/token.service");
      expect(() => TokenService.verify("invalid_token")).toThrow(
        "Token JWT inválido"
      );
    });

    it('should throw "Token JWT inválido" for NotBeforeError', async () => {
      jest.mock("jsonwebtoken");

      const { default: instanceJwt } = await import("jsonwebtoken");

      (instanceJwt.verify as jest.Mock).mockImplementation(() => {
        throw new instanceJwt.NotBeforeError("Token not active", new Date());
      });

      const { TokenService } = await import("@security/services/token.service");
      expect(() => TokenService.verify("invalid_token")).toThrow(
        "Token JWT ainda não é válido"
      );
    });

    it('should throw "Token JWT inválido" for TokenExpiredError', async () => {
      jest.mock("jsonwebtoken");

      const { default: instanceJwt } = await import("jsonwebtoken");

      (instanceJwt.verify as jest.Mock).mockImplementation(() => {
        throw new instanceJwt.TokenExpiredError("Token expired", new Date());
      });

      const { TokenService } = await import(
        "@security/services/token.service"
      );
      expect(() => TokenService.verify("invalid_token")).toThrow(
        "Token JWT expirado"
      );
    });

    it('should throw "Token JWT inválido" for default', async () => {
      jest.mock("jsonwebtoken");

      const { default: instanceJwt } = await import("jsonwebtoken");

      (instanceJwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Error default or not found");
      });

      const { TokenService } = await import(
        "@security/services/token.service"
      );
      expect(() => TokenService.verify("invalid_token")).toThrow(
        "Erro ao validar token JWT"
      );
    });
  });
});
