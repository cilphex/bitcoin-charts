function rateLimit(ms) {
  if (ms === undefined) {
    throw "ms must be defined for rate limit";
  }
  if (typeof ms !== "number") {
    throw "ms for rate limit must be a number";
  }

  return function decorator(target, name, descriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args) {
      const lastTime = descriptor.__last_rate_limit_time__ || null;
      const time = new Date().getTime();

      if (lastTime && time - lastTime < ms) {
        return;
      }

      descriptor.__last_rate_limit_time__ = time;
      original.apply(this, args);
    };

    return descriptor;
  };
}

export {
  rateLimit,
};
