-- DropForeignKey
ALTER TABLE `featurelog` DROP FOREIGN KEY `FeatureLog_satuanKerjaId_fkey`;

-- DropIndex
DROP INDEX `FeatureLog_satuanKerjaId_subSubFeatureId_key` ON `featurelog`;