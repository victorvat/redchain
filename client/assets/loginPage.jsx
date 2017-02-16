import React, { PropTypes } from 'react';
import LoginForm from '../components/LoginForm.jsx';

class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      data: {
        username: '',
        password: ''
      }
    };

    //this.processForm = this.processForm.bind(this);
    //this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  onFormProcess(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    console.log('processForm', this.state.data);

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.data.username);
    const password = encodeURIComponent(this.state.data.password);
    const formData = `username=${username}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/users/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          errors: {}
        });
        console.log('The form is valid');
        alart("Welcom!")
      } else {
        const errors = xhr.response.errors ? xhr.response.errors : {};
        alert(xhr.response.message); 
        errors.summary = xhr.response.message;
        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  onUserChange(event, fieldKey) {
    const newData = { [fieldKey]: event.target.value };
    this.setState({
      data: Object.assign({}, this.state.data, newData)
    });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.onFormProcess.bind(this)}
        onChange={this.onUserChange.bind(this)}
        errors={this.state.errors}
        //user={this.state.user}
      />
    );
  }

}

export default LoginPage;
