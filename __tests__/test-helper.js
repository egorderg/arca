function isValidArkaEntry(entry) {
  if (entry.type !== 'value' && entry.type !== 'singleton') {
    return false;
  }

  if (typeof entry.use !== 'string') {
    return false;
  }

  return entry.value != null;
}

module.exports = {
  isValidArkaEntry,
};
