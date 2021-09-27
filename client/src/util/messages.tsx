export const getMessages = async (csrf: string, skip: number) => {
  console.log(skip);
  const fetchData = await fetch(
    `http://localhost:3000/messages?count=${skip}`,
    {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
    }
  );
  const response = await fetchData.json();
  return response.docs;
};
