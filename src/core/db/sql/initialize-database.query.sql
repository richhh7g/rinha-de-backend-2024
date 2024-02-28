PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers
(
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS balances
(
    customer_id INTEGER NOT NULL PRIMARY KEY,
    'limit' INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    CONSTRAINT fk_balances_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS transactions
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    'type' CHAR(1) NOT NULL,
    amount INTEGER NOT NULL,
    'description' VARCHAR(10) NOT NULL,
    created_at BIGINT NOT NULL,
    CONSTRAINT fk_transactions_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS IX_transactions_customer_id ON transactions(customer_id);

INSERT INTO customers VALUES(1, 'Linus Torvalds') ON CONFLICT (id) DO NOTHING;
INSERT INTO customers VALUES(2, 'Richard Stallman') ON CONFLICT (id) DO NOTHING;
INSERT INTO customers VALUES(3, 'Ada Lovelace') ON CONFLICT (id) DO NOTHING;
INSERT INTO customers VALUES(4, 'Grace Hopper') ON CONFLICT (id) DO NOTHING;
INSERT INTO customers VALUES(5, 'Alan Turing') ON CONFLICT (id) DO NOTHING;

INSERT INTO balances VALUES(1,   100000, 0)  ON CONFLICT (customer_id) DO NOTHING;
INSERT INTO balances VALUES(2,    80000, 0)  ON CONFLICT (customer_id) DO NOTHING;
INSERT INTO balances VALUES(3,  1000000, 0)  ON CONFLICT (customer_id) DO NOTHING;
INSERT INTO balances VALUES(4, 10000000, 0)  ON CONFLICT (customer_id) DO NOTHING;
INSERT INTO balances VALUES(5,   500000, 0)  ON CONFLICT (customer_id) DO NOTHING;

CREATE TRIGGER IF NOT EXISTS `update_customer_balance_after_transaction` AFTER INSERT ON `transactions`
BEGIN
    UPDATE balances SET
        amount = (
            SELECT 
                COALESCE(SUM(CASE 
                                    WHEN type = 'c' THEN amount 
                                    WHEN type = 'd' THEN -amount 
                                    ELSE 0 
                                END), 0)
            FROM 
                transactions
            WHERE 
                customer_id = NEW.customer_id
        )
    WHERE 
        customer_id = NEW.customer_id;
END;
