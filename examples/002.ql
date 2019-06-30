select
  // left associative
  5 + 5 - 5,
  5 - 5 + 5,
  // mul binds tighter
  5 + 5 * 5,
  5 + 5 / 5,
  5 * 5 + 5,
  5 / 5 + 5,
  // left associative
  5 / 5 * 5,
  5 * 5 / 5,
  // mod tighter,
  5 * 5 % 5,
  5 % 5 * 5