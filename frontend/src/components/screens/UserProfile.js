import React from 'react';
import { withRouter } from 'react-router-dom';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.location.state.id,
      userName: '',
      firstName: '',
      url: 'https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png',
      post: [],
      follow: 0, //take from database later
      loginId: null,
      following: [],
      followers: [],
    };
  }
  count = 1;
  loginUserId = async () => {
    try {
      const res = await fetch('http://localhost:4000/dashboard/', {
        method: 'POST',
        headers: { jwt_token: localStorage.token },
      });
      const parseData = await res.json();

      this.setState({
        loginId: parseData.id,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  getDefaultFollow = async (id, fid) => {
    try {
      const res = await fetch('http://localhost:4000/user/defaultFollow/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          fid,
        }),
      });
      const followerValue = await res.json();
      this.setState({
        ...this.state,
        follow: followerValue[0].follow,
      });
    } catch (err) {
      console.log(err);
    }
  };

  userDetails = async () => {
    try {
      const res = await fetch('http://localhost:4000/user/profile/img/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: this.state.userId }),
      });
      const profilePic = await res.json();
      if (profilePic[0].img) {
        this.setState({
          ...this.state,
          url: profilePic[0].img,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  postDeatils = async () => {
    try {
      const res = await fetch('http://localhost:4000/user/post/');
      const postData = await res.json();

      let posts = postData.filter((obj) => obj.id === this.state.userId);
      this.setState({
        ...this.state,
        post: posts,
        userName: posts[0].last_name,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  handleFollow = () => {
    this.followerDetails();

    if (this.state.follow === 1) {
      this.setState({ ...this.state, follow: 0 });
    } else {
      this.setState({ ...this.state, follow: 1 });
    }
    setTimeout(() => {
      this.getFollowerDetails();
    }, 500);
  };

  followerDetails = async () => {
    if (this.state.loginId !== null) {
      let fol;
      if (this.state.follow === 0) {
        fol = 1;
      } else {
        fol = 0;
      }
      try {
        await fetch('http://localhost:4000/user/follow', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.loginId,
            fid: this.state.userId,
            follow: fol,
          }),
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  getFollowerDetails = async () => {
    const dataOfUser = await fetch('http://localhost:4000/user/followers');
    const orginalData = await dataOfUser.json();
    const followings = orginalData.reduce((currArr, obj) => {
      if (obj.id === this.state.loginId) {
        if (obj.follow === 1) {
          currArr.push(obj);
        }
      }
      return currArr;
    }, []);

    const follower = orginalData.reduce((currArr, obj) => {
      if (obj.fid === this.state.loginId) {
        if (obj.follow === 1) {
          currArr.push(obj);
        }
      }
      return currArr;
    }, []);

    this.setState({
      ...this.state,
      following: followings,
      followers: follower,
    });
  };

  componentDidMount() {
    this.loginUserId();
    this.userDetails();
    this.postDeatils();
    this.getFollowerDetails();
  }

  componentDidUpdate() {
    if (this.state.loginId && this.count) {
      this.count = 0;
      this.getDefaultFollow(this.state.loginId, this.state.userId);
    }
  }

  render() {
    return (
      <div style={{ maxWidth: '550px', margin: '0px auto' }}>
        <div className='profile'>
          <div className='profile-image'>
            <section>
              <img alt='profile' src={this.state.url} />
            </section>
          </div>
          <div>
            <h4>{this.state.userName}</h4>
            <div className='user-stats'>
              <h6>{this.state.post.length} posts</h6>
              <h6>{this.state.followers.length} followers</h6>
              <h6>{this.state.following.length} following</h6>
            </div>
            {!this.state.follow ? (
              <button className='btn' onClick={this.handleFollow}>
                {' '}
                Follow{' '}
              </button>
            ) : (
              <button className='btn' onClick={this.handleFollow}>
                Unfollow
              </button>
            )}
          </div>
        </div>
        <div className='gallery'>
          {this.state.post.map((obj) => {
            return (
              <img className='item' key={obj.pid} src={obj.img} alt='post' />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(UserProfile);
