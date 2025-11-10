/*
  Warnings:

  - You are about to drop the column `nama` on the `feature` table. All the data in the column will be lost.
  - You are about to drop the column `namaSatker` on the `satuankerja` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `satuankerja` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `subfeature` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `subsubfeature` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `featureaccesslog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[satuanKerjaId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SatuanKerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubFeature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubSubFeature` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `featureaccesslog` DROP FOREIGN KEY `FeatureAccessLog_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `featureaccesslog` DROP FOREIGN KEY `FeatureAccessLog_satuanKerjaId_fkey`;

-- DropForeignKey
ALTER TABLE `featureaccesslog` DROP FOREIGN KEY `FeatureAccessLog_subFeatureId_fkey`;

-- DropForeignKey
ALTER TABLE `featureaccesslog` DROP FOREIGN KEY `FeatureAccessLog_subSubFeatureId_fkey`;

-- AlterTable
ALTER TABLE `feature` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('INFORMASI', 'PENGADUAN', 'ADMINISTRASI') NOT NULL;

-- AlterTable
ALTER TABLE `satuankerja` DROP COLUMN `namaSatker`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subfeature` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subsubfeature` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updatedAt`;

-- DropTable
DROP TABLE `featureaccesslog`;

-- CreateTable
CREATE TABLE `FeatureLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `satuanKerjaId` INTEGER NOT NULL,
    `subSubFeatureId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FeatureLog_satuanKerjaId_subSubFeatureId_key`(`satuanKerjaId`, `subSubFeatureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_satuanKerjaId_key` ON `User`(`satuanKerjaId`);

-- AddForeignKey
ALTER TABLE `FeatureLog` ADD CONSTRAINT `FeatureLog_satuanKerjaId_fkey` FOREIGN KEY (`satuanKerjaId`) REFERENCES `SatuanKerja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureLog` ADD CONSTRAINT `FeatureLog_subSubFeatureId_fkey` FOREIGN KEY (`subSubFeatureId`) REFERENCES `SubSubFeature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
