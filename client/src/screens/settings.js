import React from 'react'
import {connect} from 'react-redux'
import agent from '../shared/agent'
import ListErrors from '../shared/components/list-errors'

class SettingsForm extends React.Component {
  constructor() {
    super()

    this.state = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    }

    this.updateState = field => ev => {
      const state = this.state
      const newState = Object.assign({}, state, {[field]: ev.target.value})
      this.setState(newState)
    }

    this.submitForm = ev => {
      ev.preventDefault()

      const user = Object.assign({}, this.state)
      if (!user.password) {
        delete user.password
      }

      this.props.onSubmitForm(user)
    }
  }

  componentWillMount() {
    if (this.props.currentUser) {
      Object.assign(this.state, {
        image: this.props.currentUser.image || '',
        username: this.props.currentUser.username,
        bio: this.props.currentUser.bio,
        email: this.props.currentUser.email,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.setState(
        Object.assign({}, this.state, {
          image: nextProps.currentUser.image || '',
          username: nextProps.currentUser.username,
          bio: nextProps.currentUser.bio,
          email: nextProps.currentUser.email,
        }),
      )
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              value={this.state.image}
              onChange={this.updateState('image')}
              data-e2e="profile-url"
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.updateState('username')}
              data-e2e="username"
            />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows="8"
              placeholder="Short bio about you"
              value={this.state.bio}
              onChange={this.updateState('bio')}
              data-e2e="bio"
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState('email')}
              data-e2e="email"
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password"
              value={this.state.password}
              onChange={this.updateState('password')}
              data-e2e="password"
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={this.state.inProgress}
            data-e2e="update"
          >
            Update Settings
          </button>

        </fieldset>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser,
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({type: 'LOGOUT'}),
  onSubmitForm: user =>
    dispatch({type: 'SETTINGS_SAVED', payload: agent.Auth.save(user)}),
  onUnload: () => dispatch({type: 'SETTINGS_PAGE_UNLOADED'}),
})

function Settings(props) {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={props.errors} />

            <SettingsForm
              currentUser={props.currentUser}
              onSubmitForm={props.onSubmitForm}
            />

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={props.onClickLogout}
              data-e2e="logout"
            >
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
