-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('elder', 'family', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "HelperMode" AS ENUM ('self', 'family_assisted');

-- CreateEnum
CREATE TYPE "BindingRelationType" AS ENUM ('son', 'daughter', 'spouse', 'other');

-- CreateEnum
CREATE TYPE "BindingStatus" AS ENUM ('pending', 'active', 'unbound');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('exercise', 'diet', 'medication', 'measurement');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'done', 'skipped', 'expired');

-- CreateEnum
CREATE TYPE "TaskSourceType" AS ENUM ('system_generated', 'manual_config');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('blood_pressure', 'blood_glucose', 'weight');

-- CreateEnum
CREATE TYPE "MetricCreatedByRole" AS ENUM ('elder', 'family');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "nickname" VARCHAR(64),
    "avatar" VARCHAR(255),
    "mobile" VARCHAR(32),
    "open_id" VARCHAR(128),
    "union_id" VARCHAR(128),
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elder_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "height_cm" DECIMAL(5,2),
    "weight_kg" DECIMAL(5,2),
    "chronic_conditions" JSONB,
    "common_medicines" JSONB,
    "mobility_level" "MobilityLevel" NOT NULL,
    "helper_mode" "HelperMode" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "elder_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_bindings" (
    "id" TEXT NOT NULL,
    "elder_user_id" TEXT NOT NULL,
    "family_user_id" TEXT NOT NULL,
    "relation_type" "BindingRelationType" NOT NULL,
    "status" "BindingStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_bindings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_tasks" (
    "id" TEXT NOT NULL,
    "elder_user_id" TEXT NOT NULL,
    "task_date" DATE NOT NULL,
    "task_type" "TaskType" NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'todo',
    "source_type" "TaskSourceType" NOT NULL,
    "related_content_id" TEXT,
    "due_time" VARCHAR(16),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_metrics" (
    "id" TEXT NOT NULL,
    "elder_user_id" TEXT NOT NULL,
    "metric_type" "MetricType" NOT NULL,
    "systolic" DECIMAL(6,2),
    "diastolic" DECIMAL(6,2),
    "pulse" DECIMAL(6,2),
    "glucose_value" DECIMAL(6,2),
    "glucose_period_type" VARCHAR(16),
    "weight_kg" DECIMAL(6,2),
    "created_by_role" "MetricCreatedByRole" NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "measured_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_reminders" (
    "id" TEXT NOT NULL,
    "elder_user_id" TEXT NOT NULL,
    "medicine_name" VARCHAR(128) NOT NULL,
    "dosage_text" VARCHAR(64) NOT NULL,
    "remind_time" VARCHAR(16) NOT NULL,
    "repeat_rule" VARCHAR(32) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_reports" (
    "id" TEXT NOT NULL,
    "elder_user_id" TEXT NOT NULL,
    "week_start_date" DATE NOT NULL,
    "week_end_date" DATE NOT NULL,
    "exercise_completion_rate" DECIMAL(5,2),
    "medication_completion_rate" DECIMAL(5,2),
    "metric_record_count" INTEGER NOT NULL DEFAULT 0,
    "summary_text" TEXT,
    "suggestion_list" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_open_id_key" ON "users"("open_id");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "elder_profiles_user_id_key" ON "elder_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_elder_profiles_mobility_level" ON "elder_profiles"("mobility_level");

-- CreateIndex
CREATE INDEX "idx_binding_elder_user_id" ON "family_bindings"("elder_user_id");

-- CreateIndex
CREATE INDEX "idx_binding_family_user_id" ON "family_bindings"("family_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "family_bindings_elder_user_id_family_user_id_key" ON "family_bindings"("elder_user_id", "family_user_id");

-- CreateIndex
CREATE INDEX "idx_daily_tasks_elder_user_id_task_date" ON "daily_tasks"("elder_user_id", "task_date");

-- CreateIndex
CREATE INDEX "idx_daily_tasks_status" ON "daily_tasks"("status");

-- CreateIndex
CREATE INDEX "idx_daily_tasks_task_type" ON "daily_tasks"("task_type");

-- CreateIndex
CREATE INDEX "idx_metrics_elder_user_id_metric_type" ON "health_metrics"("elder_user_id", "metric_type");

-- CreateIndex
CREATE INDEX "idx_metrics_measured_at" ON "health_metrics"("measured_at");

-- CreateIndex
CREATE INDEX "idx_medication_reminders_elder_user_id" ON "medication_reminders"("elder_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_reports_elder_user_id_week_start_date_week_end_date_key" ON "weekly_reports"("elder_user_id", "week_start_date", "week_end_date");

-- AddForeignKey
ALTER TABLE "elder_profiles" ADD CONSTRAINT "elder_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_bindings" ADD CONSTRAINT "family_bindings_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_bindings" ADD CONSTRAINT "family_bindings_family_user_id_fkey" FOREIGN KEY ("family_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_tasks" ADD CONSTRAINT "daily_tasks_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_reminders" ADD CONSTRAINT "medication_reminders_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_reports" ADD CONSTRAINT "weekly_reports_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
