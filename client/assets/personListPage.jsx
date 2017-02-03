import React, { PropTypes } from 'react';

import PersonList from '../components/personList.jsx';

class PersonListPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      dataList: []
    };

    this.processForm = this.processForm.bind(this);
  }

  processForm(event) {
    console.log("Person.processForm");

    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    formData = {};
    
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/ext/person_all');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        console.log("/api/person_all 200 readyState=", xhr.readyState);
        console.log(xhr.response);
        
        const dataList = xhr.response;

        // change the component-container state
        this.setState({
          dataList
        });

        console.log('The form is valid');
      } else {
        alert(xhr.response.message);
        
        this.setState({
          errors,
          isOpened: true,
          dataList: []
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Render the component.
   */
  render() {
    const dataList = this.state.dataList;

    return(
      <div onClick={this.processForm}>
        <PersonList dataList={dataList} />
      </div>
    )
  }
}

export default PersonListPage;
