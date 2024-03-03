SELECT
  balances.*,
  transactions.id AS transaction_id,
  transactions.type AS transaction_type,
  transactions.amount AS transaction_amount,
  transactions.created_at AS transaction_created_at,
  transactions.description AS transaction_description
FROM balances
INNER JOIN transactions ON balances.customer_id = transactions.customer_id
WHERE balances.customer_id = $1
ORDER BY transactions.created_at DESC LIMIT 10;
