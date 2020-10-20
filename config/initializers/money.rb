# When instantiating Money objects, we should set the currency explicitly
Money.default_currency = nil
# Round amounts ending in 0.5 up (eg. $6.555 => $6.56)
Money.rounding_mode = BigDecimal::ROUND_HALF_UP
