PRAGMA foreign_keys = off;

DROP TRIGGER IF EXISTS `update_customer_balance_after_transaction`;

DROP TABLE IF EXISTS balances;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS transactions;

DROP INDEX IF EXISTS IX_transactions_customer_id;
