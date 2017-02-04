import React, { PropTypes } from 'react';
import gate from '../lib/gate';

import PersonFind from '../components/personFind.jsx';
import PersonList from '../components/personList.jsx';
import OpenBtn from '../components/openBtn.jsx';

class PersonFindPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {};

    this.processForm = this.processForm.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onShowPress = this.onShowPress.bind(this)
  }

  componentWillMount() {
    this.setState({
      errors: {},
      isOpened: true,
      filter: {
        shortname: '',
        fullname: '',
        legalname: '',
        borndate: '',
        sex: ''
      },
      dataList: [],
    })
  }

  processForm(event) {
    event.preventDefault();

    gate.post('/ext/person_find', this.state.filter).then((response) => {
      const dataList = response.data;
      const isOpened = !(dataList.length > 0);
      
      this.setState({
        //errors: {},
        isOpened,
        dataList
      })
    },(reson) => {
      alert(reson);
      this.setState({
        //errors: {message: reson},
        isOpened: true,
        dataList: []
      })
    })  
  }

  onFilterChange(event) {
      event.preventDefault();

      const trg = event.target;
      const data = { [trg.placeholder]: trg.value };
      var filter = Object.assign({}, this.state.filter, data);
      console.log('onFilterChange filter', filter)
      this.setState({
        filter, 
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
    const isOpened = this.state.isOpened;

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

export default PersonFindPage;
