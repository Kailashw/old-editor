import React from 'react'
const io = require('socket.io-client')
const socket = io()
import Codemirror from 'react-codemirror';
import UserList from './UserList';
import DownloadButton from './DownloadButton'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/challengesActions';
import { Button } from 'react-bootstrap'
import 'codemirror/lib/codemirror.css';
import Editor from '../components/common/Editor';
import { withRouter } from 'react-router';

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = { code: '', users: [], currentlyTyping: null }
    socket.on('receive code', (payload) => this.updateCodeInState(payload));
    socket.on('new user join', (users) => this.joinUser(users))
    socket.on('load users and code', () => this.sendUsersAndCode())
    socket.on('receive users and code', (payload) => this.updateUsersAndCodeInState(payload))
    socket.on('user left room', (user) => this.removeUser(user))
  }

  componentDidMount() {
    if (this.props.challenge.id == undefined) {
      this.props.actions.getChallenges();
    } else {
      const user = this.props.currentUser
      sessionStorage.setItem('currentUser', user)
      const users = [...this.state.users, this.props.currentUser]
      socket.emit('room', { room: this.props.challenge.id, user: user });
      this.setState({ users: users, code : this.props.challenge.editorHtml })
    }
  }

  componentWillUnmount() {
    socket.emit('leave room', { room: this.props.challenge.id, user: this.props.currentUser })
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.currentUser
    const users = [...this.state.users, user]
    socket.emit('room', { room: nextProps.challenge.id, user: user });
    this.setState({ users: users })
  }

  sendUsersAndCode() {
    socket.emit('send users and code', { room: this.props.challenge.id, users: this.state.users, code: this.state.code })
  }

  removeUser(user) {
    const newUsers = Object.assign([], this.state.users);
    const indexOfUserToDelete = this.state.users.findIndex(Olduser => { return Olduser == user.user })
    newUsers.splice(indexOfUserToDelete, 1);
    this.setState({ users: newUsers })
  }

  joinUser(user) {
    const combinedUsers = [...this.state.users, user]
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter(user => { return user.length > 1 })
    this.setState({ users: cleanUsers })
  }


  updateCodeInState(payload) {
    this.setState({
      code: payload.code,
      currentlyTyping: payload.currentlyTyping
    });
  }

  updateCodeForCurrentUser(newCode) {
    this.setState({
      code: newCode
    })
  }

  updateUsersAndCodeInState(payload) {
    const combinedUsers = this.state.users.concat(payload.users)
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter(user => { return user.length > 1 })
    this.setState({ users: cleanUsers, code: payload.code })
  }

  codeIsHappening(newCode) {
    this.updateCodeForCurrentUser(newCode)
    this.updateCurrentlyTyping()
    socket.emit('coding event', { code: newCode, room: this.props.challenge.id, currentlyTyping: this.props.currentUser })
  }

  updateCurrentlyTyping() {
    this.setState({ currentlyTyping: this.props.currentUser })
  }

  clear(e) {
    e.preventDefault();
    this.setState({ code: '' })
    socket.emit('coding event', { code: '', room: this.props.challenge.id })
  }

  // make a call to update the mock db.
  saveDoc(e) {
    const payload = {
      id : this.props.challenge.id,
      data : this.state.code,
      currentUser : this.props.currentUser
    }
    socket.emit('saving document', { code: this.state.code, room: this.props.challenge.id })
    this.props.actions.updateDocument(payload)
  }

  render() {
    const styles = {
      display: 'inline-flex',
      minWidth: '33.3%',
      justifyContent: 'space-between'
    }

    // should be turned on to true if the current user is not the one who is typing.
    const readOnly = false

    return (
      <div>
        { /** Titles here. */}
        <h1>{this.props.challenge.title}</h1>
        <p>{this.props.challenge.description}</p>
        { /** Main Components Items here. */}
        <UserList users={this.state.users} currentlyTyping={this.state.currentlyTyping} />
        <Editor placeholder={'Come on now.. Start Editing'} editorHtml={this.state.code || this.props.challenge.editorHtml} handleChange={this.codeIsHappening.bind(this)} readOnly={readOnly} />
        { /** Action Items here. */}
        <div style={styles}>
          <Button onClick={this.saveDoc.bind(this)} className="col-lg-12"> Save Document</Button>
          <DownloadButton text={this.state.code} title={this.props.challenge.title} />
          <Button onClick={this.clear.bind(this)} className="col-lg-12">Clear</Button>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state, ownProps) {
  if (state.challenges.length > 0) {
    const challenge = state.challenges.filter(challenge => { return challenge.id == ownProps.params.id })[0]
    const userName = sessionStorage.currentUser || state.currentUser
    return { challenge: challenge, currentUser: userName }
  } else {
    return { challenge: { title: '', description: '', source: '' }, currentUser: '' }
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room)
