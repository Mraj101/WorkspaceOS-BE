
ALTER TABLE expense_tracker_budgets
    ADD CONSTRAINT check_left_amount CHECK(left_amount >=0);