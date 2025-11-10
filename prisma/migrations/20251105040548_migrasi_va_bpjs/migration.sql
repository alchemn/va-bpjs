-- CreateTable
CREATE TABLE `SatuanKerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaSatker` VARCHAR(191) NOT NULL,
    `kabupatenKota` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubFeature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `featureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubSubFeature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `subFeatureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeatureAccessLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `satuanKerjaId` INTEGER NOT NULL,
    `featureId` INTEGER NULL,
    `subFeatureId` INTEGER NULL,
    `subSubFeatureId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubFeature` ADD CONSTRAINT `SubFeature_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubSubFeature` ADD CONSTRAINT `SubSubFeature_subFeatureId_fkey` FOREIGN KEY (`subFeatureId`) REFERENCES `SubFeature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureAccessLog` ADD CONSTRAINT `FeatureAccessLog_satuanKerjaId_fkey` FOREIGN KEY (`satuanKerjaId`) REFERENCES `SatuanKerja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureAccessLog` ADD CONSTRAINT `FeatureAccessLog_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureAccessLog` ADD CONSTRAINT `FeatureAccessLog_subFeatureId_fkey` FOREIGN KEY (`subFeatureId`) REFERENCES `SubFeature`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureAccessLog` ADD CONSTRAINT `FeatureAccessLog_subSubFeatureId_fkey` FOREIGN KEY (`subSubFeatureId`) REFERENCES `SubSubFeature`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
