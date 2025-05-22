import zod from 'zod';

export const schema = zod.object({
  email: zod.string({ message: 'Digite o email corretamente.' }).email(),
  password: zod
    .string({ message: 'Digite a senha corretamente.' })
    .min(6)
});

export type schemaInterface = zod.infer<typeof schema>;
