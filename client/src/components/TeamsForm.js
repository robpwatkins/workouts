import { useState } from 'react';

const TeamsForm = () => {
  const [name, setName] = useState('');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const team = { name, abbreviation, primary, secondary };

    const response = await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify(team),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const json = await response.json();

    if (response.ok) {
      setName('');
      setAbbreviation('');
      setPrimary('');
      setSecondary('');
      console.log('new team added', json);
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new team</h3>

      <label>Team Name:</label>
      <input
        type="text"
        onChange={e => setName(e.target.value)}
        value={name}
      />

      <label>Abbreviation:</label>
      <input
        type="text"
        onChange={e => setAbbreviation(e.target.value)}
        value={abbreviation}
      />

      <label>Primary:</label>
      <input
        type="text"
        onChange={e => setPrimary(e.target.value)}
        value={primary}
      />

      <label>Secondary:</label>
      <input
        type="text"
        onChange={e => setSecondary(e.target.value)}
        value={secondary}
      />

      <button>Add Team</button>
    </form>
  )
}

export default TeamsForm;