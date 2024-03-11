SELECT * FROM balances WHERE customer_id = $1 AND ($2 = 'c' OR ( $2 = 'd' AND (amount - $3) >= - "limit"));
