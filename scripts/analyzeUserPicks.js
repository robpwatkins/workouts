const userPickData = require('../data/userPickData.json');
const activeUsers = [
  // { _id: '642b6e304c469cff2fd4af18', email: 'robpwatkins@gmail.com' },
  // { _id: '65ff8c2ad8f1c29f44e381d0', email: 'r.watkins@zollege.com' },
  { _id: '65fb6ffe8cb630c7c3b81b0e', email: 'kevinrossen@gmail.com' },
  { _id: '65ff4b1c7e6073029db84bb1', email: 'irbytexan@yahoo.com' },
  { _id: '65ff83827e6073029db84c92', email: 'tribefan6180@yahoo.com' },
  { _id: '66044d5c0563647d7690dc8e', email: 'jmnewmyer11@gmail.com' },
  { _id: '66047d700563647d7690dca1', email: 'theserieschallenge2022@gmail.com' },
  { _id: '6604ad980563647d7690dcd5', email: 'sooner2001@hotmail.com' },
  { _id: '6604da0d0563647d7690dcdf', email: 'crussell_44@hotmail.com' },
  { _id: '6604db710563647d7690dced', email: 'vraymond8@hotmail.com' },
  { _id: '6604ef070563647d7690dd02', email: 'boreed009@yahoo.com' },
];

(() => {
  for (const user of activeUsers) {
    const { email } = user;
    const userPicks = userPickData.filter(pick => pick.email === email);
    const successfulPicks = userPicks.filter(pick => pick.successful);
    const successRate = successfulPicks.length / userPicks.length;
    console.log(`${email}: ${successRate}`);
  }
})();