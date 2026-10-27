const { PI } = Math;

// Export functions so another file can use them.
exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;
