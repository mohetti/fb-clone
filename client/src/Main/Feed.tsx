import React, { useContext, useEffect, useState, useRef } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { UserContext } from '../Authentication/userContext';
import { CSRFContext } from '../Authentication/csrfContext';
import uniqid from 'uniqid';
import { getMessages } from '../util/messages';
import Moment from 'react-moment';
import moment from 'moment';

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

function Feed(props: any) {
  const [messages, setMessages] = useState<any>(undefined);
  const [editMsg, setEditMsg] = useState('');
  const currentEditText = useRef<any>('');
  const [loadMessages, setLoadMessages] = useState(true);

  const user = useContext(UserContext);
  const csrf = useContext(CSRFContext);

  const [skip, setSkip] = useState<any>(0);

  useEffect(() => {
    if (loadMessages && skip > 0) {
      getMessages(csrf, skip).then((res) => {
        if (messages === undefined) return setMessages(res);
        let copy = [...messages];
        copy.push(...res);
        console.log(copy);
        setMessages(copy);
        console.log(messages);
        return setLoadMessages(false);
      });
    }
    if (loadMessages && skip === 0) {
      getMessages(csrf, skip).then((res) => {
        setMessages(res);
        return setLoadMessages(false);
      });
    }
    return;
  }, [loadMessages, csrf]);

  let test = 'test';
  // TESTING INFINITE SCROLL
  const handleScroll = (e: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop === scrollHeight) {
      console.log('Test');
      setSkip(messages!.length);
      setLoadMessages(true);
    }
    if (offsetHeight + scrollTop !== scrollHeight) {
      setSkip(0);
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
    return setLoadMessages(true);
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

                {user && x.likes.indexOf(user.userInfo!._id) !== -1 ? (
                  <div>I like</div>
                ) : (
                  <div>I dont like</div>
                )}
                <button onClick={like} id={x._id}>
                  Likes {x.likes.length}
                </button>
                {user && x.user._id === user.userInfo!._id && (
                  <button onClick={deleteMessage} id={x._id}>
                    Delete
                  </button>
                )}
                <button
                  onClick={(e) => {
                    editMessage(e, x.message);
                  }}
                  id={x._id}
                >
                  Edit
                </button>
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
      {user && (
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
