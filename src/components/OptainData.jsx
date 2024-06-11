import React, { useEffect, useState } from 'react';

const Data = () => {
  const [userDataList, setUserDataList] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080");
      if (!response.ok) {
        const errorBody = await response.text(); // Convert response body to text
        throw new Error(errorBody);
      }

      const jsonData = await response.json();
      setUserDataList(jsonData);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error(error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Convert response body to text
        throw new Error(errorBody);
      }

      setName('');
      setPassword('');
      fetchData(); // Refetch data after successful POST
    } catch (error) {
      console.error(error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Convert response body to text
        throw new Error(errorBody);
      }

      fetchData(); // Refetch data after successful DELETE
    } catch (error) {
      console.error(error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>} {/* Display error message if error state is set */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>

      {userDataList && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Img</th>
              <th>Nombre</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userDataList.map((userData, index) => (
              <tr key={index}>
                <td>{userData.id}</td>
                <td>
                  <img height={100} src={`http://localhost:8080/${userData.id}/getImg`} alt="" />
                </td>
                <td>{userData.name}</td>
                <td>{userData.password}</td>
                <td>
                  <button onClick={() => handleDelete(userData.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Data;
