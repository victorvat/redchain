import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import gate from '../lib/gate';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Table } from 'react-bootstrap';
import OpenBtn from '../components/openBtn.jsx';

const FrmFind = ({
  onSubmit,
  onChange,
  data
}) => (
  <Form horizontal onSubmit={ onSubmit }>
      <h1>Contact</h1>

    <FormGroup controlId="4F948007-ACD6-437A-9CCE-4F68F6F35B15-frmfind_key">
      <Col componentClass={ControlLabel} sm={2}>
        Key
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.key || "key"}
           value={data.key || ""}
           onChange={(event) => onChange(event,"key",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="4F948007-ACD6-437A-9CCE-4F68F6F35B15-frmfind_phrase">
      <Col componentClass={ControlLabel} sm={2}>
        Phrase
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.phrase || "phrase"}
           value={data.phrase || ""}
           onChange={(event) => onChange(event,"phrase",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="4F948007-ACD6-437A-9CCE-4F68F6F35B15-frmfind_stateId">
      <Col componentClass={ControlLabel} sm={2}>
        StateId
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.stateid || "stateid"}
           value={data.stateid || ""}
           onChange={(event) => onChange(event,"stateid",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={2}>
        <Button type="submit">
            Find
        </Button>
      </Col>
    </FormGroup>
  </Form>
);

FrmFind.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const FrmListRow = ({
  value,
  index,
  onClick
}) => (
   <tr onClick={(event)=>onClick(event, value.ccontact)}>
      <td>{value.key}</td>
      <td>{value.phrase}</td>
      <td>{value.stateid}</td>
   </tr>
);

const FrmList = ({
  onClick,
  dataList
}) => (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
      <td>key</td>
      <td>phrase</td>
      <td>stateId</td>
      </tr>
    </thead>
    <tbody>
        { dataList.map((rValue,rIndex) => (
           <FrmListRow 
              key={rValue.ccontact}
              value={rValue}
              index={rIndex}
              onClick={onClick}
           />
        ))}
    </tbody>
  </Table>
);


class FindPage extends React.Component {
  componentWillMount() {
    this.setState({
      errors: {},
      isOpened: true,
      filter: {},
      dataList: [],
    })
  }

  onFindPress(event) {
    event.preventDefault();

    const postData = {
      cmd: 'select',
      params: this.state.filter
    }
    gate.post('/api/contact', postData)
    .then( response => {
      const dataList=response.data;
      this.setState({
        errors: {},
        isOpened: (dataList.length < 1),
        dataList
      })
    })
    .catch( reson => {
      alert(reson);      
      this.setState({
        errors: {message: reson},
        isOpened: true,
        dataList: []
      })
    })  
  }

  onFilterChange(event, fieldKey) {
    const newData = { [fieldKey]: event.target.value };
    var filter = Object.assign({}, this.state.filter, newData);
    this.setState({
      filter, 
      dataList: []
    });
  }

  onShowPress(event) {
    this.setState({
      isOpened: true 
    });
  }

  onRowPress(event, key) {
    event.preventDefault();
    browserHistory.push('/d/contact/edit/'+key);
  }
  
  render() {
    const dataList = this.state.dataList;
    const isOpened = this.state.isOpened;

    let _headText;
    if (isOpened) {
      _headText = (
          <FrmFind 
            onSubmit={this.onFindPress.bind(this)}
            onChange={this.onFilterChange.bind(this)}
            data={this.state.filter}
          />
      )
    } else {
      _headText = ( 
          <OpenBtn onClick={this.onShowPress.bind(this)} />
      )
    }
    return(
      <div>
        { _headText }
        <FrmList 
          onClick={this.onRowPress.bind(this)}
          dataList={dataList} 
        />
      </div>
    )
  }
};

const FrmEdit = ({
  onSubmit,
  onChange,
  data,
  mode
}) => (
  <Form horizontal onSubmit={ onSubmit }>
    <h1>Contact</h1>

    <FormGroup controlId="4F948007-ACD6-437A-9CCE-4F68F6F35B15-frmedit-phrase">
      <Col componentClass={ControlLabel} sm={2}>
        Phrase
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.phrase || "phrase"}
           value={data.phrase || ""}
           onChange={(event) => onChange(event,"phrase",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="4F948007-ACD6-437A-9CCE-4F68F6F35B15-frmedit-stateid">
      <Col componentClass={ControlLabel} sm={2}>
        StateId
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.stateid || "stateid"}
           value={data.stateid || ""}
           onChange={(event) => onChange(event,"stateid",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={2}>
        <Button type="submit">
            Save
        </Button>
      </Col>
      <Col smOffset={6} sm={2}>
        <Button href="/d/contact/find">
            Cancel
        </Button>
      </Col>      
    </FormGroup>
  </Form>
);

FrmEdit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired
};


class EditPage extends React.Component {

  componentWillMount() {
    this.setState({
      errors: {},
      data: {},
      mode: {}
    })
  }

  componentDidMount() {
    const postData = {
      cmd: 'select',
      params: {
        ccontact: this.props.params.ccontact
      }
    }
    gate.post('/api/contact', postData)
    .then( response => {
      console.log('got', response.data);
      this.setState({
        data: response.data[0]
      })
    })
    .catch( reson => {
      alert(reson);      
      this.setState({
        errors: {message: reson},
        data: {}
      })
    })  
  }

  onFormSubmit(event) {
    event.preventDefault();
    console.log('Save', this.state.data);
    const postData = {
      cmd: 'update',
      params: this.state.data
    }
    gate.post('/api/contact', postData)
    .then( response => {
      console.log('got', response.meesage);
      this.setState({
        writeReady: false,
      })
    })
    .catch( reson => {
      alert(reson);      
      this.setState({
        errors: {message: reson},
        data: {}
      })
    })  
  }
 
  onFieldChange(event, fieldKey) {
    const newData = { [fieldKey]: event.target.value };
    var data = Object.assign({}, this.state.data, newData);
    this.setState({ 
      data 
    });
  }

  render() {
    return (
      <FrmEdit
        onSubmit={this.onFormSubmit.bind(this)}
        onChange={this.onFieldChange.bind(this)}
        data={this.state.data} 
        mode={this.state.mode} 
      />
    )
  }
};

EditPage.propTypes = {
  params: PropTypes.object.isRequired
};


class CreatePage extends React.Component {
  componentWillMount() {
    this.setState({
      errors: {},
      data: {},
      mode: {}
    })
  }

  componentDidMount() {
    console.log('DidMount', this.state.data);
  }

  onFormSubmit(event) {
    event.preventDefault();
    console.log('Save', this.state.data);
    const postData = {
      cmd: 'insert',
      params: this.state.data
    }
    gate.post('/api/contact', postData)
    .then( response => {
      console.log('got', response.meesage);
      alert(response.meesage);      
      browserHistory.push('/d/contact/find');
    })
    .catch( reson => {
      alert('API_ERROR: '+reson);      
      this.setState({
        errors: {message: reson},
        data: {}
      })
    })  
  }
 
  onFieldChange(event, fieldKey) {
    const newData = { [fieldKey]: event.target.value };
    var data = Object.assign({}, this.state.data, newData);
    this.setState({ 
      data 
    });
  }

  render() {
    return (
      <FrmEdit
        onSubmit={this.onFormSubmit.bind(this)}
        onChange={this.onFieldChange.bind(this)}
        data={this.state.data} 
        mode={this.state.mode} 
      />
    )
  }
};

export default {FindPage, EditPage, CreatePage};