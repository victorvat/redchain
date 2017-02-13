import React, { PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import gate from '../lib/gate';


class StateLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      dataList: []
    }
  }

  componentDidMount() {
    gate.post('/api/state', {cmd: 'select'})
    .then( response => {
      this.setState({
        errors: {},
        dataList: response.data
      })
    })
    .catch( reson => {
      this.setState({
        errors: {message: reson},
        dataList: []
      })
    })  
  }

  onChangeValue(event) {
     if (event.target.value === "#") {
       event.target.value = undefined;
     }
     this.props.onChange(event);
  }

  render() {
    const dataList = this.state.dataList;

    return (
        <FormControl componentClass="select" 
          onChange={this.onChangeValue.bind(this)}
          value={this.props.value || "#"}
        >
          { (this.props.mandatory) || (
             <option key={-1} value="#">-----</option>
          )}          
          { dataList.map((row,index) => (
              <option key={row.cstate} value={row.cstate}>
                {row.state}
              </option>  
           ))}
        </FormControl>
    )
  }
};

StateLookup.propTypes = {
  onChange: PropTypes.func.isRequired
  // value: PropTypes...
  // mandatory: PropTypes.boolean...
};

export default StateLookup;