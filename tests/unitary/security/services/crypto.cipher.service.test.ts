import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CryptoCipherService } from "@root/src/security/services/crypto.cipher.service";

import { InternalServerError } from "@root/src/error/erros.mudule";

describe("/security/services/crypto.cipher.service.ts", () => {
  const KEY = "44fa128c-c4e0-4102-9bfa-94ca4efd2acb";
  const IV = "d129df89-20ed-42ff-b09f-75f92642d876";

  const inputEncrypt = "fe82ca1d-4c3b-4542-ba0b-389956d01e7b";
  const outputEncrypt =
    "NmNjOTM4N2MxZjZiMTRhNjQ3NGViMGNkYzQ2ZTRlMzZkZDhiMWZmNGE2Y2NlZTM4MDkxMGQ2OWMzZjU1NWQ2ZWJkY2IzNDNiOjo0ZjQwNGZlODA1ZDdiOWFmMjg3OWYyNDhiYjk3ZWUzZQ==";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should error decrypt aes-256-gcm encrypt", () => {
    const cipher = CryptoCipherService.cipher("aes-256-gcm", KEY, IV);

    expect(() => cipher.decrypt(123 as any)).toThrow(InternalServerError);
  });

  it("should error create hash crypto aes-256-gcm encrypt", () => {
    const cipher = CryptoCipherService.cipher("aes-256-gcm", KEY, IV);
    expect(() => cipher.encrypt(123 as any)).toThrow(InternalServerError);
  });

  it("should create hash crypto aes-256-gcm encrypt ", () => {
    const cipher = CryptoCipherService.cipher("aes-256-gcm", KEY, IV);
    const tokenOutput = cipher.encrypt(inputEncrypt);
    expect(tokenOutput).toEqual(expect.any(String));
  });

  it("should compare crypto aes-256-gcm encrypt to token local ", () => {
    const cipher = CryptoCipherService.cipher("aes-256-gcm", KEY, IV);
    const tokenOutput = cipher.encrypt(inputEncrypt);
    expect(tokenOutput).toEqual(outputEncrypt);
  });

  it("should get value decrypt hash aes-256-gcm ", () => {
    const cipher = CryptoCipherService.cipher("aes-256-gcm", KEY, IV);

    const tokenOutput = cipher.encrypt(inputEncrypt);
    const responseDecrypt = cipher.decrypt(tokenOutput);

    expect(responseDecrypt).toBe(inputEncrypt);
  });
});
