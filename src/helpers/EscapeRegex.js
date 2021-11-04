module.exports = (s) => {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}