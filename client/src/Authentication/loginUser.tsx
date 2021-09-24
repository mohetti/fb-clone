const login = async (values: any) => {
  const data = JSON.stringify({
    email: values.email,
    password: values.password,
  });
  const fetchData = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'xsrf-token': values.csrf,
    },
    body: data,
  });
  const response = await fetchData.json();
  return response;
};
export const loginUser = login;
