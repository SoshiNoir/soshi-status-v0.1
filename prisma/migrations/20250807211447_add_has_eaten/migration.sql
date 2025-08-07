-- 1) Adicione a coluna como NULLABLE
ALTER TABLE "Status" ADD COLUMN "hasEaten" BOOLEAN;

-- 2) Preencha a coluna com um valor padrão para as linhas existentes
UPDATE "Status" SET "hasEaten" = false WHERE "hasEaten" IS NULL;

-- 3) Torne a coluna obrigatória (NOT NULL)
ALTER TABLE "Status" ALTER COLUMN "hasEaten" SET NOT NULL;
