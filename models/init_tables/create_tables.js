//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// static initial creation of tables

/**
 * @typedef {Object} Book
 * @property {Number} id
 * @property {Number} created_at
 * @property {Number} modified_at
 *
 * @property {Boolean} isPrimary
 * @property {String} name
 *
 */
/**
 * @typedef {Object} Currency
 * @property {Number} id
 * @property {Number} created_at
 * @property {Number} modified_at
 *
 * @property {BASE_DIV} baseDiv
 * @property {String} code
 *
 */
/**
 * @typedef {Object} Source
 * @property {Number} id
 * @property {Number} created_at
 * @property {Number} modified_at
 *
 * @property {connection_type} connectionType
 * @property {String} name
 * @property {Object} details
 *
 */
/**
 * @typedef {Object} Entity
 * @property {Number} id
 * @property {Number} created_at
 * @property {Number} modified_at
 *
 * @property {Boolean} isPrimary
 * @property {String} name
 * @property {Object} details
 * @property {entity_type} entityType
 * @property {Number} parent
 *
 */
/**
 * @typedef {Object} account_type
 * @property {Number} id
 * @property {Number} created_at
 * @property {Number} modified_at
 *
 * @property {Boolean} isExternal
 * @property {String} name
 * @property {Object} details
 *
 */

const CREATE_TABLES_QUERY = `CREATE TYPE "BASE_DIV" AS ENUM (
  '100',
  '1'
);


CREATE TYPE "connection_type" AS ENUM (
  'import',
  'api',
  'scheduled',
  'auto',
  'manual'
);

CREATE TYPE "entity_type" AS ENUM (
  'income',
  'vendor',
  'expenseSource'
);

CREATE TYPE "class_type" AS ENUM (
  'standard',
  'recurring',
  'long_term',
  'unplanned'
);

CREATE TABLE "BOOK" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" varchar(100),
  "isPrimary" boolean,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp
);

CREATE TABLE "CURRENCY" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "code" varchar(100),
  "baseDiv" BASE_DIV,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp NOT NULL
);

CREATE TABLE "Source" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" varchar(100),
  "connectionType" connection_type NOT NULL,
  "details" jsonb,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp
);

CREATE TABLE "Entity" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" varchar(100) UNIQUE NOT NULL,
  "parent" int,
  "details" jsonb,
  "entityType" entity_type NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp
);

CREATE TABLE "account_type" (
  "name" varchar(100) UNIQUE PRIMARY KEY NOT NULL,
  "isExternal" boolean,
  "details" jsonb,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp
);

CREATE TABLE "Account" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" varchar(100),
  "number" int NOT NULL,
  "source" int,
  "details" jsonb,
  "parent" int,
  "placeholder" boolean NOT NULL DEFAULT false,
  "accountType" varchar(100) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp
);

CREATE TABLE "transaction" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "docNum" varchar(100),
  "tranDate" date NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp NOT NULL,
  "currency" int NOT NULL DEFAULT 1,
  "book" int NOT NULL DEFAULT 1,
  "details" jsonb,
  "exchangeRate" decimal NOT NULL DEFAULT 1
);

CREATE TABLE "classification" (
  "id" SERIAL UNIQUE NOT NULL,
  "name" varchar(255) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp NOT NULL,
  "description" varchar(255),
  "details" jsonb
);

CREATE TABLE "transaction_line" (
  "id" SERIAL UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "modified_at" timestamp NOT NULL,
  "tran" int NOT NULL,
  "account" int NOT NULL,
  "entity" int,
  "debit" int,
  "credit" int,
  "details" jsonb,
  "class" int NOT NULL,
  PRIMARY KEY ("tran", "id")
);

ALTER TABLE "Entity" ADD FOREIGN KEY ("id") REFERENCES "Entity" ("parent");

ALTER TABLE "Account" ADD FOREIGN KEY ("id") REFERENCES "Account" ("parent");

ALTER TABLE "Account" ADD FOREIGN KEY ("accountType") REFERENCES "account_type" ("name") ON DELETE RESTRICT;

ALTER TABLE "Account" ADD FOREIGN KEY ("source") REFERENCES "Source" ("id") ON DELETE RESTRICT;

ALTER TABLE "transaction" ADD FOREIGN KEY ("currency") REFERENCES "CURRENCY" ("id") ON DELETE RESTRICT;

ALTER TABLE "transaction" ADD FOREIGN KEY ("book") REFERENCES "BOOK" ("id") ON DELETE RESTRICT;

ALTER TABLE "transaction_line" ADD FOREIGN KEY ("tran") REFERENCES "transaction" ("id") ON DELETE CASCADE;

ALTER TABLE "transaction_line" ADD FOREIGN KEY ("account") REFERENCES "Account" ("id") ON DELETE RESTRICT;

ALTER TABLE "transaction_line" ADD FOREIGN KEY ("entity") REFERENCES "Entity" ("id") ON DELETE RESTRICT;

ALTER TABLE "transaction_line" ADD FOREIGN KEY ("class") REFERENCES "classification" ("id") ON DELETE RESTRICT;

CREATE INDEX "created_at_index" ON "BOOK" ("created_at");

CREATE INDEX "created_at_index" ON "CURRENCY" ("created_at");

CREATE INDEX "created_at_index" ON "Source" ("created_at");

CREATE INDEX "created_at_index" ON "Entity" ("created_at");

CREATE INDEX "name_index" ON "Entity" ("name");

CREATE INDEX "created_at_index" ON "account_type" ("created_at");

CREATE INDEX "name_index" ON "account_type" ("name");

CREATE INDEX "created_at_index" ON "Account" ("created_at");

CREATE INDEX "acc_num_index" ON "Account" ("number");

CREATE INDEX "acc_name_index" ON "Account" ("name");

CREATE INDEX "created_at_index" ON "transaction" ("created_at");

CREATE INDEX "transaction_date_index" ON "transaction" ("tranDate");

CREATE INDEX "document_number_index" ON "transaction" ("docNum");

CREATE INDEX "created_at_index" ON "classification" ("created_at");

CREATE INDEX "name index" ON "classification" ("name");

CREATE INDEX "created_at_index" ON "transaction_line" ("created_at");

CREATE INDEX "account_index" ON "transaction_line" ("account");
`;

// runner function
