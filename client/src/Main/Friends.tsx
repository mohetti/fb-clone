import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { CSRFContext } from '../Authentication/csrfContext';
import { UserContext } from '../Authentication/userContext';
import uniqid from 'uniqid';

function Friends(props: any) {
  const [rerender, setRerender] = useState(true);
  const [friends, setFriends] = useState<[any] | undefined>(undefined);
  const [friendsSuggestions, setFriendSuggestions] = useState<
    [any] | undefined
  >(undefined);
  const [answerFriendRequest, setAnswerFriendRequest] = useState<
    [any] | undefined
  >(undefined);
  const [waitForResponse, setWaitForResponse] = useState<[any] | undefined>(
    undefined
  );

  const csrf = useContext(CSRFContext);
  const user = useContext(UserContext);
  const { userInfo, setUserInfo } = useContext(UserContext);

  const getUsersList = async () => {
    const fetchData = await fetch(
      'https://smc-mh.herokuapp.com/friends/suggestions',
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
  useEffect(() => {
    if (rerender) {
      getUsersList().then((res) => {
        const friends: any = [];
        const friendsSuggestions: any = [];
        const answerFriendRequest: any = [];
        const waitForResponse: any = [];

        res.map((x: any) => {
          if (x.friends.indexOf(user?.userInfo!._id) !== -1) {
            return friends.push(x);
          }
          if (user?.userInfo!.friendsRequest.indexOf(x._id) !== -1) {
            return answerFriendRequest.push(x);
          }
          if (x.friendsRequest.indexOf(user.userInfo!._id) !== -1) {
            return waitForResponse.push(x);
          }
          return friendsSuggestions.push(x);
        });
        setFriends(friends);
        setFriendSuggestions(friendsSuggestions);
        setAnswerFriendRequest(answerFriendRequest);
        setWaitForResponse(waitForResponse);
        setRerender(false);
      });
    }
    // eslint-disable-next-line
  }, [rerender]);

  const addFriend = async (id: any) => {
    await fetch('https://smc-mh.herokuapp.com/friends/request', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ id: id }),
    });
    return setRerender(true);
  };

  const acceptFriend = async (id: any) => {
    const fetchData = await fetch(
      'https://smc-mh.herokuapp.com/friends/response',
      {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'xsrf-token': csrf,
        },
        body: JSON.stringify({ id: id }),
      }
    );
    const response = await fetchData.json();
    setUserInfo(response.docs);
    return setRerender(true);
  };

  const deleteFriend = (id: any) => {
    fetch('https://smc-mh.herokuapp.com/friends/delete', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ id: id }),
    }).then((res) => {
      return setRerender(true);
    });
  };

  const deleteRequest = (id: any) => {
    fetch('https://smc-mh.herokuapp.com/friends/delete/friendrequest', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ id: id }),
    }).then((res) => {
      return setRerender(true);
    });
  };

  const renderUsers = (userList: any, source: any) => {
    return (
      <div className='friends-list'>
        {userList.map((x: any) => {
          return (
            <div key={uniqid()}>
              <img src={'https://smc-mh.herokuapp.com/' + x.img} alt='friend' />
              <div>
                {x.firstName} {x.surName}
              </div>
              {source === 'suggestion' && (
                <button
                  onClick={() => {
                    addFriend(x._id);
                  }}
                >
                  Add
                </button>
              )}
              {source === 'accept' && (
                <button
                  onClick={() => {
                    acceptFriend(x._id);
                  }}
                >
                  Accept
                </button>
              )}
              {source === 'friends' && (
                <button
                  onClick={() => {
                    deleteFriend(x._id);
                  }}
                >
                  Delete
                </button>
              )}
              {source === 'wait' && (
                <button
                  onClick={() => {
                    deleteRequest(x._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <h2 className='mg3'>Friends</h2>
      <Navbar />
      <div className='light-border'>
        <h3>Answer Requests</h3>
        {answerFriendRequest && renderUsers(answerFriendRequest, 'accept')}
      </div>
      <div className='light-border'>
        <h3>Friends</h3>
        {friends && renderUsers(friends, 'friends')}
      </div>
      <div className='light-border'>
        <h3>Suggestions</h3>
        {friendsSuggestions && renderUsers(friendsSuggestions, 'suggestion')}
      </div>
      <div className='light-border'>
        <h3>Await Response</h3>
        {waitForResponse && renderUsers(waitForResponse, 'wait')}
      </div>
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Friends;
