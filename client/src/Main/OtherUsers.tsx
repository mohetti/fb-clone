import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { CSRFContext } from '../Authentication/csrfContext';
import { UserContext } from '../Authentication/userContext';
import uniqid from 'uniqid';
import Moment from 'react-moment';
import moment from 'moment';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';

import likeImg from '../imgs/like.png';
import noLikeImg from '../imgs/no-like.png';

function OtherUsers(props: any) {
  const [user, setUser] = useState<any>(undefined);
  const [messages, setMessages] = useState<any>(undefined);
  const profile: { id: string } = useParams();
  const csrf = useContext(CSRFContext);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const comments = useRef<any>({});
  const history = useHistory();

  const [readmore, setReadmore] = useState<any>('');

  const fetchUser = async () => {
    const data = JSON.stringify({ id: profile.id });
    const fetchData = await fetch('https://smc-mh.herokuapp.com/user/', {
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

    setUser(response.docs);
  };

  const fetchMessages = async () => {
    const data = JSON.stringify({ id: profile.id });
    const fetchData = await fetch('https://smc-mh.herokuapp.com/messages', {
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

    await fetch('https://smc-mh.herokuapp.com/likes/messages', {
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

    await fetch('https://smc-mh.herokuapp.com/messages/comment', {
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

  const goToProfile = (e: React.SyntheticEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.id === currentUser.userInfo._id
      ? history.push(`/profile`)
      : history.push(`/profile/${target.id}`);
    setLoading(true);
  };

  // if id === logged in user redirect to /profile
  return (
    <div>
      <div className='mg3'></div>
      <Navbar />
      {user && (
        <div>
          <div className='mg5'>
            <img
              className='profile-img'
              src={'https://smc-mh.herokuapp.com/' + user.img}
              alt='profile'
            />
            <span className='mgl'>
              {user.firstName} {user.surName}
            </span>
          </div>
          <div className='bio'>{user.bio}</div>
          {messages && (
            <div
              className='msg-container'
              style={{ height: '500px', overflowY: 'auto' }}
            >
              {messages.map((x: any) => {
                return (
                  <div className='msg-border' key={uniqid()}>
                    <div
                      id={x.user._id}
                      onClick={goToProfile}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={'https://smc-mh.herokuapp.com/' + x.user.img}
                        alt='hello'
                      />
                      <span>
                        {x.user.firstName} {x.user.surName}
                      </span>
                    </div>

                    <div>
                      <span className='mgl'>{formatDate(x)}</span>
                    </div>
                    <div className='msg'>{x.message}</div>
                    {currentUser.userInfo &&
                    x.likes.indexOf(currentUser.userInfo._id) !== -1 ? (
                      <div>
                        <img src={likeImg} alt='like' />
                      </div>
                    ) : (
                      <div>
                        <img src={noLikeImg} alt='no like' />
                      </div>
                    )}
                    <button className='btn-small' onClick={like} id={x._id}>
                      Likes {x.likes.length}
                    </button>
                    <div>
                      {x._id === readmore &&
                        x.comments
                          .slice(0)
                          .reverse()
                          .map((y: any, i: any) => {
                            return (
                              <div className='msg-border' key={uniqid()}>
                                <div
                                  id={y.user.id}
                                  onClick={goToProfile}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <img
                                    className='msg-img'
                                    src={
                                      'https://smc-mh.herokuapp.com/' +
                                      y.user.img
                                    }
                                    alt='hello'
                                  />
                                  <span>
                                    {y.user.firstName} {y.surName}
                                  </span>
                                </div>
                                <div className='msg'>{y.comment}</div>
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
                              <div className='msg-border' key={uniqid()}>
                                <div
                                  id={y.user.id}
                                  onClick={goToProfile}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <img
                                    src={
                                      'https://smc-mh.herokuapp.com/' +
                                      y.user.img
                                    }
                                    className='msg-img'
                                    alt='hello'
                                  />
                                  <span>
                                    {y.user.firstName} {y.surName}
                                  </span>
                                </div>
                                <div className='msg'>{y.comment}</div>
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
                          {x._id !== readmore ? (
                            <span style={{ cursor: 'pointer' }} className='mgl'>
                              Read more...
                            </span>
                          ) : (
                            <span style={{ cursor: 'pointer' }} className='mgl'>
                              Read less...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {
                      <form
                        className='mgt mgl'
                        id={x._id}
                        action='submit'
                        onSubmit={addComment}
                      >
                        <textarea
                          onChange={(e) => updateComment(e, x._id)}
                          placeholder='Comment...'
                        />
                        <div>
                          <button className='btn-small mg4' type='submit'>
                            Submit Comment
                          </button>
                        </div>
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
