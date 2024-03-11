UPDATE balances AS b
  SET amount = (
      SELECT COALESCE(
          SUM(
              CASE
                  WHEN t."type" = 'c' THEN t.amount
                  WHEN t."type" = 'd' THEN -t.amount
                  ELSE 0
               END
          ),
          0
        )
      FROM transactions AS t
      WHERE t.customer_id = $1
  )
WHERE b.customer_id = $1;
