-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "browserName" TEXT,
    "deviceType" TEXT,
    "os" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Sessions" ("browserName", "createdAt", "deviceType", "id", "ipAddress", "location", "os", "updatedAt", "userId") SELECT "browserName", "createdAt", "deviceType", "id", "ipAddress", "location", "os", "updatedAt", "userId" FROM "Sessions";
DROP TABLE "Sessions";
ALTER TABLE "new_Sessions" RENAME TO "Sessions";
CREATE UNIQUE INDEX "Sessions_id_key" ON "Sessions"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
