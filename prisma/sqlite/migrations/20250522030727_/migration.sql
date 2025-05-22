-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" INTEGER,
    "message" TEXT NOT NULL,
    "detais" TEXT,
    "instance_error" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_temp" BOOLEAN DEFAULT true
);
