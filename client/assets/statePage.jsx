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
      <h1>Состояние</h1>

    <FormGroup controlId="1E11146A-AA35-4B15-94E8-A148F7A80B8A-frmfind_state">
      <Col componentClass={ControlLabel} sm={2}>
        State
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.state || "state"}
           value={data.state || ""}
           onChange={(event) => onChange(event,"state",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="1E11146A-AA35-4B15-94E8-A148F7A80B8A-frmfind_state_en">
      <Col componentClass={ControlLabel} sm={2}>
        State_en
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.state_en || "state_en"}
           value={data.state_en || ""}
           onChange={(event) => onChange(event,"state_en",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
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
   <tr onClick={(event)=>onClick(event, value.cstate)}>
      <td>{value.state}</td>
      <td>{value.state_en}</td>
   </tr>
);

const FrmList = ({
  onClick,
  dataList
}) => (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
      <td>state</td>
      <td>state_en</td>
      </tr>
    </thead>
    <tbody>
        { dataList.map((rValue,rIndex) => (
           <FrmListRow 
              key={rValue.cstate}
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
    gate.post('/api/state', postData)
    .then( response => {
      console.log('got', response.data);
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
    browserHistory.push('/d/person/'+key);
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
    <h1>Состояние</h1>

    <FormGroup controlId="1E11146A-AA35-4B15-94E8-A148F7A80B8A-frmedit-state">
      <Col componentClass={ControlLabel} sm={2}>
        State
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.state || "state"}
           value={data.state || ""}
           onChange={(event) => onChange(event,"state",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="1E11146A-AA35-4B15-94E8-A148F7A80B8A-frmedit-state_en">
      <Col componentClass={ControlLabel} sm={2}>
        State_en
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.state_en || "state_en"}
           value={data.state_en || ""}
           onChange={(event) => onChange(event,"state_en",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
            Save
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
        cstate: this.props.params.cstate
      }
    }
    gate.post('/api/state', postData)
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
    gate.post('/api/state', postData)
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
    gate.post('/api/state', postData)
    .then( response => {
      console.log('got', response.meesage);
      alert(response.meesage);      
      this.setState({
        writeReady: false,
      })
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