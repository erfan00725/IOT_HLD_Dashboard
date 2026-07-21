-- Migration: add_device_types_and_device_type_states

CREATE TABLE "device_types" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL, -- note: fixed typo from "lable"
  "icon" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id")
);

CREATE TABLE "device_type_states" (
  "id" BIGSERIAL NOT NULL,
  "device_type_id" TEXT NOT NULL,
  "state_key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "is_safe_state" BOOLEAN NULL DEFAULT FALSE,
  PRIMARY KEY ("id"),
  UNIQUE ("device_type_id", "state_key"),
  FOREIGN KEY ("device_type_id") REFERENCES "device_types"("id")
);