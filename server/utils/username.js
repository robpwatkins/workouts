const { generateUsername } = require('unique-username-generator');

const getUniqueUsername = async (userModel) => {
  const username = generateUsername('-', 3);
  const user = await userModel.findOne({ username });
  if (user) return await getUniqueUsername();
  return username;
};

module.exports = { getUniqueUsername };