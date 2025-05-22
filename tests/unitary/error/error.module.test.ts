import { describe, it, expect, beforeEach } from "@jest/globals";
import { AxiosResponse } from "axios";
import {
  NotFoundError,
  AuthenticationError,
  AxiosRequestServiceError,
  ConflictError,
  ExternalServerError,
  InternalServerError,
  UnprocessableEntityError,
  HandleInstanceError,
} from "@error/erros.mudule";

describe("#error/error.module.ts", () => {
  it("should return error instanceof NotFoundError", () => {
    const messageError = "Ocorreu um erro teste";

    const error = new NotFoundError(messageError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("NotFoundError");
    expect(error.message).toBe(messageError);
    expect(error.status).toBe(404);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  it("should return error instanceof AuthenticationError", () => {
    const messageError = "Ocorreu um erro teste";

    const error = new AuthenticationError(messageError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("AuthenticationError");
    expect(error.message).toBe(messageError);
    expect(error.status).toBe(401);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  it("should return error instanceof ConflictError", () => {
    const messageError = "Ocorreu um erro teste";

    const error = new ConflictError(messageError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("ConflictError");
    expect(error.message).toBe(messageError);
    expect(error.status).toBe(409);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  it("should return error instanceof UnprocessableEntityError", () => {
    const messageError = "Ocorreu um erro teste";
    const dataError = { message: messageError };
    const error = new UnprocessableEntityError(messageError, dataError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("UnprocessableEntity");
    expect(error.message).toBe(messageError);
    expect(error.status).toBe(422);
    expect(error.data).toBe(dataError);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  it("should return error instanceof AxiosRequestServiceError", () => {
    const messageError = "Ocorreu um erro teste";
    const responseError = {
      status: 422,
      data: { title: "error" },
      config: { url: "teste" },
      statusText: "422",
      headers: { "Content-Type": "application/json", url: "teste" },
    } as unknown as AxiosResponse;
    const error = new AxiosRequestServiceError(messageError, responseError);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(messageError);
    expect(error.status).toBe(responseError.status);

    expect(error.data).toEqual({
      data: responseError.data,
      message: responseError.config.url,
      status: responseError.status,
      statusText: responseError.statusText,
      headers: responseError.headers,
      timestamp: expect.any(String),
    });

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  it("should return error instanceof InternalServerError", () => {
    const contextError = "context error";
    const error = new InternalServerError(contextError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("Internal Server Error");
    expect(error.message).toBe("Ocorreu um erro no sistema, tente novamente.");
    expect(error.status).toBe(500);
    expect(error.context).toBe(contextError);
  });

  it("should return error instanceof ExternalServerError", () => {
    const contextError = "context error";
    const error = new ExternalServerError(contextError);

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe("External Server Error");
    expect(error.message).toBe(
      "Ocorreu um erro ao consultar um serviço externo, tente novamente mais tarde."
    );
    expect(error.status).toBe(503);
    expect(error.context).toBe(contextError);
  });

  it("should return object listInstancesError HandleInstanceError", () => {
    const messageError = "Ocorreu um erro teste";

    const error = new NotFoundError(messageError);
    const responseHandler = HandleInstanceError(error);

    const expectedResponse = {
      status: 404,
      message: messageError,
    };
    expect(responseHandler).toEqual(expectedResponse);
  });

  it("should return object listErrosInternal HandleInstanceError", () => {
    const messageError = "Ocorreu um erro teste";
    const responseError = {
      status: 422,
      data: { title: "error" },
      config: { url: "teste" },
      statusText: "422",
      headers: { "Content-Type": "application/json", url: "teste" },
    } as unknown as AxiosResponse;
    const error = new AxiosRequestServiceError(messageError, responseError);
    const responseHandler = HandleInstanceError(error);

    const expectedResponse = {
      status: 503,
      message: messageError,
    };
    expect(responseHandler).toEqual(expectedResponse);
  });
});
