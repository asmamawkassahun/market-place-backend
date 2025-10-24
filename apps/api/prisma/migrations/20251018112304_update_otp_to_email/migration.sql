/*
  Warnings:

  - You are about to drop the column `phone` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Otp" DROP CONSTRAINT "Otp_phone_fkey";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "phone",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
