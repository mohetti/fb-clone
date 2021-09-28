import React, { useRef, useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CSRFContext } from '../Authentication/csrfContext';
import { UserContext } from '../Authentication/userContext';
import uniqid from 'uniqid';
import Moment from 'react-moment';
import moment from 'moment';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';

function OtherUsers(props: any) {
  const [user, setUser] = useState<any>(undefined);
  const [messages, setMessages] = useState<any>(undefined);
  const profile: { id: string } = useParams();
  const csrf = useContext(CSRFContext);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const comments = useRef<any>({});

  const [readmore, setReadmore] = useState<any>('');

  const fetchUser = async () => {
    const data = JSON.stringify({ id: profile.id });
    const fetchData = await fetch('http://localhost:3000/user/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: data,
    });
    const response = await fetchData.json();
    console.log(response);

    setUser(response.docs);
  };

  const fetchMessages = async () => {
    const data = JSON.stringify({ id: profile.id });
    const fetchData = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: data,
    });
    const response = await fetchData.json();
    setMessages(response.docs);
  };
  useEffect(() => {
    if (csrf !== '' && loading) {
      fetchUser();
      fetchMessages();
      setLoading(false);
    }
  }, [csrf, loading]);

  const formatDate = (x: any) => {
    const fromNow = moment(x.time).fromNow();
    const arr = fromNow.split(' ');

    if (
      (+arr[0] > 10 && arr[1] === 'days') ||
      arr[1] === 'months' ||
      arr[1].indexOf('year') !== -1
    ) {
      return <Moment format='DD.MM.YY'>{x.time}</Moment>;
    }
    return fromNow;
  };

  const like = async (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    await fetch('http://localhost:3000/likes/messages', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ likedMessage: target.id }),
    });

    return setLoading(true);
  };

  const addComment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (
      comments.current[target.id] === undefined ||
      comments.current[target.id] === ''
    ) {
      return;
    }
    const data = JSON.stringify({
      msgId: target.id,
      msg: comments.current[target.id],
    });

    await fetch('http://localhost:3000/messages/comment', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: data,
    });
    return setLoading(true);
  };

  const updateComment = (e: React.SyntheticEvent, msgId: string) => {
    const target = e.target as HTMLInputElement;
    if (comments.current[msgId])
      return (comments.current[msgId] = target.value);

    comments.current = { ...comments.current, [msgId]: target.value };
  };

  // if id === logged in user redirect to /profile
  return (
    <div>
      <Navbar />
      {user && (
        <div>
          <div>
            <img
              style={{ height: '50px', width: '50px' }}
              src={'http://localhost:3000/' + user.img}
              alt='profile'
            />
            {user.firstName} {user.surName}
            {user.bio}
          </div>
          {messages && (
            <div>
              {messages.map((x: any) => {
                return (
                  <div key={uniqid()}>
                    <div>
                      <div>
                        {x.user.firstName} {x.user.surName}
                      </div>
                      <img
                        src={'http://localhost:3000/' + x.user.img}
                        style={{ height: '50px', width: '50px' }}
                        alt='hello'
                      />
                      <div>{formatDate(x)}</div>
                      <div>{x.message}</div>
                    </div>
                    {user.userInfo &&
                    x.likes.indexOf(currentUser.userInfo._id) !== -1 ? (
                      <div>I like</div>
                    ) : (
                      <div>I dont like</div>
                    )}
                    <button onClick={like} id={x._id}>
                      Likes {x.likes.length}
                    </button>
                    <div>
                      {x._id === readmore &&
                        x.comments
                          .slice(0)
                          .reverse()
                          .map((y: any, i: any) => {
                            return (
                              <div key={uniqid()}>
                                <img
                                  src={'http://localhost:3000/' + y.user.img}
                                  style={{ height: '50px', width: '50px' }}
                                  alt='hello'
                                />
                                <div>
                                  {y.user.firstName} {y.surName}
                                </div>
                                <div>{y.comment}</div>
                              </div>
                            );
                          })}
                      {x._id !== readmore &&
                        x.comments
                          .slice(0)
                          .reverse()
                          .slice(0, 3)
                          .map((y: any, i: any) => {
                            return (
                              <div key={uniqid()}>
                                <img
                                  src={'http://localhost:3000/' + y.user.img}
                                  style={{ height: '50px', width: '50px' }}
                                  alt='hello'
                                />
                                <div>
                                  {y.user.firstName} {y.surName}
                                </div>
                                <div>{y.comment}</div>
                              </div>
                            );
                          })}
                      {x.comments.length > 3 && (
                        <div
                          onClick={() => {
                            readmore === x._id
                              ? setReadmore('')
                              : setReadmore(x._id);
                          }}
                        >
                          Read more...
                        </div>
                      )}
                    </div>
                    {
                      <form id={x._id} action='submit' onSubmit={addComment}>
                        <input
                          type='text'
                          onChange={(e) => updateComment(e, x._id)}
                          placeholder='Comment...'
                        />
                        <button type='submit'>Submit Comment</button>
                      </form>
                    }
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default OtherUsers;
