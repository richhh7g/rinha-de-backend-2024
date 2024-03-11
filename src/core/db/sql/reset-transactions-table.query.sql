BEGIN;

DELETE FROM transactions;
UPDATE balances SET amount = 0;

COMMIT;