import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../Authentication/userContext';
import { CSRFContext } from '../Authentication/csrfContext';
import uniqid from 'uniqid';
import { getMessages } from '../util/messages';
import Moment from 'react-moment';
import moment from 'moment';

import likeImg from '../imgs/like.png';
import noLikeImg from '../imgs/no-like.png';

function Messages(props: any) {
  const [messages, setMessages] = useState<any>(undefined);
  const [editMsg, setEditMsg] = useState('');
  const currentEditText = useRef<any>('');
  const comments = useRef<any>({});

  const user = useContext(UserContext);
  const csrf = useContext(CSRFContext);

  const history = useHistory();

  const [skip, setSkip] = useState<any>(10);
  const [readmore, setReadmore] = useState<any>('');

  useEffect(() => {
    if (props.rerender) {
      getMessages(csrf, skip).then((res) => {
        if (messages === undefined) return setMessages(res);
        setMessages(res);
      });
    }

    // eslint-disable-next-line
  }, [props.rerender, csrf]);

  // TESTING INFINITE SCROLL
  const handleScroll = (e: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;

    if (
      offsetHeight + scrollTop === scrollHeight &&
      messages!.length % 10 === 0
    ) {
      let newVal = skip + 10;
      setSkip(newVal);
      return props.callRerender();
    }
  };

  const postMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      message: { value: string };
    };

    if (target.message.value === '') return;

    const message = {
      message: target.message.value,
    };
    await fetch('https://smc-mh.herokuapp.com/messages/create', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify(message),
    });
    props.callRerender();
    return props.callRerender();
  };

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

    return props.callRerender();
  };

  const deleteMessage = async (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    await fetch('https://smc-mh.herokuapp.com/messages/delete', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ deleteMessage: target.id }),
    });

    return props.callRerender();
  };

  const editMessage = (e: React.SyntheticEvent, message: string) => {
    const target = e.target as HTMLInputElement;
    currentEditText.current = message;
    if (target.id === editMsg) {
      return setEditMsg('');
    }
    return setEditMsg(target.id);
  };
  const cancel = (message: string) => {
    return setEditMsg('');
  };

  const submitChanges = async (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    if (currentEditText.current.value === '') return;
    const data = JSON.stringify({
      message: currentEditText.current.value,
      id: id,
    });
    await fetch('https://smc-mh.herokuapp.com/messages/edit', {
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
    setEditMsg('');
    return props.callRerender();
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
    return props.callRerender();
  };

  const updateComment = (e: React.SyntheticEvent, msgId: string) => {
    const target = e.target as HTMLInputElement;
    if (comments.current[msgId])
      return (comments.current[msgId] = target.value);

    comments.current = { ...comments.current, [msgId]: target.value };
  };

  const goToProfile = (e: React.SyntheticEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.id === user.userInfo._id
      ? history.push(`/profile`)
      : history.push(`/profile/${target.id}`);
  };

  const renderMessages = () => {
    if (messages) {
      return (
        <div
          className='msg-container'
          style={{ height: '500px', overflowY: 'auto' }}
          onScroll={handleScroll}
        >
          {messages.map((x: any) => {
            return (
              <div className='msg-border' key={uniqid()}>
                <div
                  style={{ cursor: 'pointer' }}
                  id={x.user._id}
                  onClick={goToProfile}
                >
                  <div>
                    <img src={x.user.img} alt='hello' />
                    <span>
                      {x.user.firstName} {x.user.surName}
                    </span>
                  </div>
                </div>
                <div>
                  <span>{formatDate(x)}</span>
                </div>
                {editMsg === x._id ? (
                  <form
                    action='submit'
                    onSubmit={(e) => {
                      submitChanges(e, x._id);
                    }}
                  >
                    <div className='edit-box'>
                      <div>
                        <textarea
                          ref={currentEditText}
                          defaultValue={x.message}
                        />
                      </div>
                      <div className='edit-btns mgl'>
                        <button className='btn-small' type='submit'>
                          Submit Changes
                        </button>
                        <div
                          className='cancel-edit mgt'
                          onClick={() => {
                            cancel(x.message);
                          }}
                        >
                          Cancel
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className='msg'>{x.message}</div>
                )}

                {user.userInfo && x.likes.indexOf(user.userInfo!._id) !== -1 ? (
                  <div>
                    <img src={likeImg} alt='like' />
                  </div>
                ) : (
                  <div>
                    <img src={noLikeImg} alt='no like' />
                  </div>
                )}
                <div className='msg-btns'>
                  <div className='like-btn'>
                    <button className='btn-small' onClick={like} id={x._id}>
                      Likes {x.likes.length}
                    </button>
                  </div>
                  {user.userInfo && x.user._id === user.userInfo!._id && (
                    <div
                      className='cancel-edit'
                      onClick={deleteMessage}
                      id={x._id}
                    >
                      Delete
                    </div>
                  )}
                  {user.userInfo && x.user._id === user.userInfo!._id && (
                    <div
                      className='cancel-edit mgl'
                      onClick={(e) => {
                        editMessage(e, x.message);
                      }}
                      id={x._id}
                    >
                      Edit
                    </div>
                  )}
                </div>
                <div className='mgt mgl'>
                  <span>Comments...</span>
                </div>
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
                                src={y.user.img}
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
                                className='msg-img'
                                src={y.user.img}
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
      );
    }
    return;
  };

  return (
    <div>
      <form
        className='centering msg-form'
        action='submit'
        onSubmit={postMessage}
      >
        <textarea placeholder="What's on your mind?" name='message' />
        <button type='submit'>Post message</button>
      </form>
      {messages && renderMessages()}
    </div>
  );
}

export default Messages;
