const LIMITS = { low: 480, medium: 240, high: 60, critical: 15 };

function responseMinutes(priority) {
  if (!Object.hasOwn(LIMITS, priority)) {
    throw new RangeError('Unknown priority');
  }
  return LIMITS[priority];
}

module.exports = { responseMinutes };
