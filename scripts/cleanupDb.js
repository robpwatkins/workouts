const serverUrl = 'http://localhost:4001';

(async () => {
  const users = await (await fetch(`${serverUrl}/users`)).json();

  for await (const { _id: userId, email } of users) {
    const userPicks = await (await fetch(`${serverUrl}/api/picks?user_id=${userId}`)).json();
    
    console.log({ email, userId, userPicks });
  }

  // const inactiveUsers = users.filter(user => (
  //   !user.active &&
  //   !['642b6e304c469cff2fd4af18', '65ff8c2ad8f1c29f44e381d0'].includes(user._id)
  // ));
  
  // for await (const { _id: userId, email } of inactiveUsers) {
  //   const inactiveUserPicks = await (await fetch(`${serverUrl}/api/picks?user_id=${userId}`)).json();
    
  //   for await (const { _id: pickId } of inactiveUserPicks) {
  //     const response = await fetch(`${serverUrl}/api/picks/${pickId}`, {
  //       method: 'DELETE',
  //       headers: { 'Content-Type': 'application/json' }
  //     });

  //     if (response.ok) console.log(`Deleted pick ${pickId} for user ${email}`);
  //   }
  // }
})();