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
    const fetchData = await fetch('http://localhost:3000/friends/suggestions', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
    });
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
    await fetch('http://localhost:3000/friends/request', {
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
    const fetchData = await fetch('http://localhost:3000/friends/response', {
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
    const response = await fetchData.json();
    setUserInfo(response.docs);
    return setRerender(true);
  };

  const deleteFriend = (id: any) => {
    fetch('http://localhost:3000/friends/delete', {
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
    fetch('http://localhost:3000/friends/delete/friendrequest', {
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
      <div>
        {userList.map((x: any) => {
          return (
            <div key={uniqid()}>
              <div>{x.firstName}</div>
              {source === 'suggestion' && (
                <button
                  onClick={() => {
                    addFriend(x._id);
                  }}
                >
                  Add friend
                </button>
              )}
              {source === 'accept' && (
                <button
                  onClick={() => {
                    acceptFriend(x._id);
                  }}
                >
                  Accept Friend
                </button>
              )}
              {source === 'friends' && (
                <button
                  onClick={() => {
                    deleteFriend(x._id);
                  }}
                >
                  Delete Friend
                </button>
              )}
              {source === 'wait' && (
                <button
                  onClick={() => {
                    deleteRequest(x._id);
                  }}
                >
                  Delete Request
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
      <Navbar />
      <div>**************ANSWER REQ*****************</div>
      {answerFriendRequest && renderUsers(answerFriendRequest, 'accept')}
      <div>**************FRIENDS**********</div>
      {friends && renderUsers(friends, 'friends')}
      <div>*****************SUGGESTIONS*************</div>
      {friendsSuggestions && renderUsers(friendsSuggestions, 'suggestion')}
      <div>**************WAIT**************</div>
      {waitForResponse && renderUsers(waitForResponse, 'wait')}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Friends;
