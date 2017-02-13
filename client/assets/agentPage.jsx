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
      <h1>Агент</h1>

    <FormGroup controlId="E782C3E9-7E57-40FE-878C-8BE136F7813F-frmfind_agent">
      <Col componentClass={ControlLabel} sm={2}>
        Agent
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.agent || "agent"}
           value={data.agent || ""}
           onChange={(event) => onChange(event,"agent",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="E782C3E9-7E57-40FE-878C-8BE136F7813F-frmfind_memo">
      <Col componentClass={ControlLabel} sm={2}>
        Memo
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.memo || "memo"}
           value={data.memo || ""}
           onChange={(event) => onChange(event,"memo",)} 
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
   <tr onClick={(event)=>onClick(event, value.cagent)}>
      <td>{value.agent}</td>
      <td>{value.memo}</td>
   </tr>
);

const FrmList = ({
  onClick,
  dataList
}) => (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
      <td>Agent</td>
      <td>Memo</td>
      </tr>
    </thead>
    <tbody>
        { dataList.map((rValue,rIndex) => (
           <FrmListRow 
              key={rValue.cagent}
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
    gate.post('/api/agent', postData)
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
    browserHistory.push('/d/agent/edit/'+key);
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
    <h1>Агент</h1>

    <FormGroup controlId="E782C3E9-7E57-40FE-878C-8BE136F7813F-frmedit-agent">
      <Col componentClass={ControlLabel} sm={2}>
        Agent
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.agent || "agent"}
           value={data.agent || ""}
           onChange={(event) => onChange(event,"agent",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="E782C3E9-7E57-40FE-878C-8BE136F7813F-frmedit-memo">
      <Col componentClass={ControlLabel} sm={2}>
        Memo
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.memo || "memo"}
           value={data.memo || ""}
           onChange={(event) => onChange(event,"memo",)} 
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
        <Button href="/d/agent/find">
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
        cagent: this.props.params.cagent
      }
    }
    gate.post('/api/agent', postData)
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
    gate.post('/api/agent', postData)
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
    gate.post('/api/agent', postData)
    .then( response => {
      console.log('got', response.meesage);
      alert(response.meesage);      
      browserHistory.push('/d/agent/find');
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