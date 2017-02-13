import React, { PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import gate from '../lib/gate';


const OpRuleLookupRow = ({
  value
}) => (
  <option value={value.crule}>
    {value.rule}
  </option>  
);

class OpRuleLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      dataList: []
    }
  }

  componentDidMount() {
    gate.post('/api/%.l:code%', {cmd: 'select'})
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

  render() {
    const dataList = this.state.dataList;

    return (
        <FormControl componentClass="select" 
          onChange={this.props.onChange}
          defaultValue={this.props.value}
        >
          { (this.props.mandatory) || (
             <option key={-1} value=""></option>
          )}          
          { dataList.map((row,index) => (
              <StateLookupRow key={row.crule} value={row} />
           ))}
        </FormControl>
    )
  }
};

OpRuleLookup.propTypes = {
  onChange: PropTypes.func.isRequired
  // value: PropTypes...
  // mandatory: PropTypes.boolean...
};

export default OpRuleLookup;