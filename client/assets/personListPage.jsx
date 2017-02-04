import React, { PropTypes } from 'react';
import gate from '../lib/gate';

import PersonList from '../components/personList.jsx';

class PersonListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      dataList: []
    };
  }

  componentDidMount() {
    gate.get('/api/person/all').then((response) => {
      this.setState({
        errors: {},
        dataList: response.data
      })
    },(reson) => {
      this.setState({
        errors: {message: reson},
        dataList: []
      })
    })  
  }

  render() {
    const dataList = this.state.dataList;

    return(
      <PersonList dataList={dataList} />
    )
  }
}

export default PersonListPage;
