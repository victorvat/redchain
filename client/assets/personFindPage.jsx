import React, { PropTypes } from 'react';

import PersonFind from '../components/personFind.jsx';
import PersonList from '../components/personList.jsx';
import OpenBtn from '../components/openBtn.jsx';

class FindPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      isOpened: true,
      filter: {
        shortName: '',
        fullName: '',
        legalName: '',
        bornDate: '',
        sex: ''
      },
      dataList: [],
    };

    this.processForm = this.processForm.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onShowPress = this.onShowPress.bind(this)
  }

  getCleanFilter() {
    return {
        shortName: '',
        fullName: '',
        legalName: '',
        bornDate: '',
        sex: ''
    } 
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    console.log("Person.processForm");

    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const filter = this.state.filter;
    //const shortName = encodeURIComponent(filter.shortName);
    //const fullName = encodeURIComponent(filter.fullName);
    //const legalName = encodeURIComponent(filter.legalName);
    //const formData = `shortName=${shortName}&fullName=${fullName}`;

    var formData = JSON.stringify(this.state.filter);

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/ext/person_find');
    //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        console.log("/api/person_find 200 readyState=", xhr.readyState);
        console.log(xhr.response);
        
        const dataList = xhr.response;
        const isOpened = !(dataList.length > 0);

        // change the component-container state
        this.setState({
          errors: {},
          isOpened,
          dataList
        });

        console.log('The form is valid');
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
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

  onFilterChange(event) {
      event.preventDefault();
      const trg = event.target;
      const name = trg.placeholder;
      var filter = Object.assign({}, this.state.filter, {[name]: trg.value});
      console.log('onFilterChange filter', filter)
      this.setState({
        filter, 
        isOpened: true,
        dataList: []
      });
    }

  onShowPress(event) {
      console.log('onShowPress');
      this.setState({
        isOpened: true 
      });
  }

  /**
   * Render the component.
   */
  render() {
    const dataList = this.state.dataList;
    const isOpened = this.state.isOpened || (dataList.length < 1);

    let _headText;
    if (isOpened) {
        _headText = (
          <PersonFind 
            onSubmit={this.processForm}
            onChange={this.onFilterChange}
            errors={this.state.errors}
          />
        )
    } else {
        _headText = ( 
          <OpenBtn onClick={this.onShowPress} />
        )
    }
    return(
      <div>
        { _headText }
        <PersonList dataList={dataList} />
      </div>
    )
  }
}

export default FindPage;
