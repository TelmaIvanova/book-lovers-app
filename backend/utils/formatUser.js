function formatUser(user) {
  if (!user) return 'Unknown';
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  if (user.username) return user.username;
  return 'User';
}

module.exports = formatUser;
