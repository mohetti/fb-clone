import React, { useContext, useEffect, useState, useRef } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { UserContext } from '../Authentication/userContext';
import { CSRFContext } from '../Authentication/csrfContext';
import uniqid from 'uniqid';
import { getMessages } from '../util/messages';
import Moment from 'react-moment';
import moment from 'moment';

/*
type ResponseSchema = {
  _id: string;
  message: string;
  time: string;
  comments: [string];
  likes: [string];
  user: {
    firstName: string;
    surName: string;
    _id: string;
  };
};
*/

function Feed(props: any) {
  const [messages, setMessages] = useState<any>(undefined);
  const [editMsg, setEditMsg] = useState('');
  const currentEditText = useRef<any>('');
  const comments = useRef<any>({});
  const [loadMessages, setLoadMessages] = useState(true);

  const user = useContext(UserContext);
  const csrf = useContext(CSRFContext);

  const [skip, setSkip] = useState<any>(10);
  const [readmore, setReadmore] = useState<any>('');

  useEffect(() => {
    if (loadMessages || skip) {
      getMessages(csrf, skip).then((res) => {
        if (messages === undefined) return setMessages(res);
        setMessages(res);
        return setLoadMessages(false);
      });
    }

    // eslint-disable-next-line
  }, [skip, loadMessages, csrf]);

  // TESTING INFINITE SCROLL
  const handleScroll = (e: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;

    if (
      offsetHeight + scrollTop === scrollHeight &&
      messages!.length % 10 === 0
    ) {
      let newVal = skip + 10;
      setSkip(newVal);
      setLoadMessages(true);
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
    await fetch('http://localhost:3000/messages/create', {
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

    return setLoadMessages(true);
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

    return setLoadMessages(true);
  };

  const deleteMessage = async (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    await fetch('http://localhost:3000/messages/delete', {
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

    setLoadMessages(true);
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
    await fetch('http://localhost:3000/messages/edit', {
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
    return setLoadMessages(true);
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
    return setLoadMessages(true);
  };

  const updateComment = (e: React.SyntheticEvent, msgId: string) => {
    const target = e.target as HTMLInputElement;
    if (comments.current[msgId])
      return (comments.current[msgId] = target.value);

    comments.current = { ...comments.current, [msgId]: target.value };
  };

  const renderMessages = () => {
    if (messages) {
      return (
        <div
          style={{ height: '500px', overflowY: 'auto' }}
          onScroll={handleScroll}
        >
          {messages.map((x: any) => {
            return (
              <div key={uniqid()}>
                <div>
                  {x.user.firstName} {x.user.surName}
                </div>
                <img
                  src={x.user.img}
                  style={{ height: '50px', width: '50px' }}
                  alt='hello'
                />
                <div>{formatDate(x)}</div>
                {editMsg === x._id ? (
                  <form
                    action='submit'
                    onSubmit={(e) => {
                      submitChanges(e, x._id);
                    }}
                  >
                    <input
                      type='text'
                      ref={currentEditText}
                      defaultValue={x.message}
                    />
                    <button type='submit'>Submit Changes</button>
                    <button
                      onClick={() => {
                        cancel(x.message);
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div>{x.message}</div>
                )}

                {user.userInfo && x.likes.indexOf(user.userInfo!._id) !== -1 ? (
                  <div>I like</div>
                ) : (
                  <div>I dont like</div>
                )}
                <button onClick={like} id={x._id}>
                  Likes {x.likes.length}
                </button>
                {user.userInfo && x.user._id === user.userInfo!._id && (
                  <button onClick={deleteMessage} id={x._id}>
                    Delete
                  </button>
                )}
                {user.userInfo && x.user._id === user.userInfo!._id && (
                  <button
                    onClick={(e) => {
                      editMessage(e, x.message);
                    }}
                    id={x._id}
                  >
                    Edit
                  </button>
                )}
                <div>
                  {x._id === readmore &&
                    x.comments.map((y: any, i: any) => {
                      return (
                        <div key={uniqid()}>
                          <img
                            src={y.user.img}
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
                    x.comments.slice(0, 3).map((y: any, i: any) => {
                      return (
                        <div key={uniqid()}>
                          <img
                            src={y.user.img}
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
      );
    }
    return;
  };
  return (
    <div>
      <Navbar />
      {user.userInfo && (
        <div>
          {user.userInfo!.firstName} {user.userInfo!.surName}
        </div>
      )}
      <form action='submit' onSubmit={postMessage}>
        <input type='text' placeholder="What's on your mind?" name='message' />
        <button type='submit'>Post message</button>
      </form>
      {messages && renderMessages()}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Feed;
