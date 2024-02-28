INSERT INTO
  transactions (
    customer_id,
    'type',
    amount,
    'description',
    created_at
  )
VALUES
  ($1, $2, $3, $4,$5);
