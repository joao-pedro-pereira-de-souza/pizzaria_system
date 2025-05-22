import { describe, it, expect, jest } from "@jest/globals";
import bcrypt from "bcryptjs";

describe('security/services/crypto', () => {

   it("should create hash and compare hash to value", async () => {
     const value = "senhaTest";

     const spieHashSync = jest.spyOn(bcrypt, "hashSync");
     const spieCompareSync = jest.spyOn(bcrypt, "compareSync");

     const { CryptoService } = await import(
       "@security/services/crypto.service"
     );

     const hash = CryptoService.generate(value);

     const compare = CryptoService.compare(value, hash);

     expect(hash).toEqual(expect.any(String));
     expect(spieHashSync).toHaveBeenCalledWith(value, 10);

     expect(spieCompareSync).toHaveBeenCalledWith(value, hash);
     expect(compare).toEqual(true);
   });
})
