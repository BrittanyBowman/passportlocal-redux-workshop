import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

//redux
import { connect } from 'react-redux';
import { login } from './redux/reducers/user_reducer';

class App extends Component {
  constructor(){
    super()

    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (key, event) => {
    this.setState({
      [key]: event.target.value
    })
  };

  handleLogin = () => {
    const {username, password} = this.state;

    const userCredentials = {
      username,
      password
    }

    axios.post('/auth/login', userCredentials).then(response => {
      const user = response.data;
      this.props.login(user);
    })
  }

  render() {
    console.log(this.props);
    return (
      <div className="App">
        <input type="text" placeholder="username.." onChange={(event) => this.handleChange('username', event)}/>
        <input type="text" placeholder="password.." onChange={(event) => this.handleChange('password', event)}/>
        <button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {login})(App);
