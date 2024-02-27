INSERT INTO transactions
    (created_at, customer_id, "type", amount, "description", )
VALUES
    ($2, $3, $4, $5, $6)
ON CONFLICT (customer_id) DO NOTHING;
