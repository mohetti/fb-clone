export const getMessages = async (csrf: string, skip: number) => {
  const fetchData = await fetch(
    `https://mohetti.github.io/fb-clone/messages?count=${skip}`,
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
