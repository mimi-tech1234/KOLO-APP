INSERT INTO price_benchmarks (region, item_name, category, benchmark_price, currency, source)
VALUES
  ('Lagos', 'Leather Shoes Repair', 'Cobbler', 5000, 'NGN', 'Kolo Survey Q2 2026'),
  ('Lagos', 'Ankara Dress Sewing', 'Tailoring', 18000, 'NGN', 'Kolo Survey Q2 2026'),
  ('Accra', 'Hair Braiding (Medium)', 'Hair', 220, 'GHS', 'Kolo Survey Q2 2026'),
  ('Kumasi', 'Metal Gate Welding (per m2)', 'Welding', 750, 'GHS', 'Kolo Survey Q2 2026'),
  ('Ibadan', 'Cooked Meal Tray', 'Food', 2500, 'NGN', 'Kolo Survey Q2 2026')
ON CONFLICT DO NOTHING;
