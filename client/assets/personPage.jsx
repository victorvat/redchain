import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import gate from '../lib/gate';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Table } from 'react-bootstrap';
import StateLookup from './stateLookup.jsx';
import OpenBtn from '../components/openBtn.jsx';

const FrmFind = ({
  onSubmit,
  onChange,
  data
}) => (
  <Form horizontal onSubmit={ onSubmit }>
      <h1>Персона</h1>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmfind_cState">
      <Col componentClass={ControlLabel} sm={2}>
        CState
      </Col>
      <Col sm={4}>
        <StateLookup
           value={data.cstate}  
           onChange={(event) => onChange(event,"cstate")}
           mandatory={false}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmfind_shortName">
      <Col componentClass={ControlLabel} sm={2}>
        ShortName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.shortname || "shortname"}
           value={data.shortname || ""}
           onChange={(event) => onChange(event,"shortname",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmfind_fullName">
      <Col componentClass={ControlLabel} sm={2}>
        FullName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.fullname || "fullname"}
           value={data.fullname || ""}
           onChange={(event) => onChange(event,"fullname",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmfind_legalName">
      <Col componentClass={ControlLabel} sm={2}>
        LegalName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.legalname || "legalname"}
           value={data.legalname || ""}
           onChange={(event) => onChange(event,"legalname",)} 
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
   <tr onClick={(event)=>onClick(event, value.pid)}>
      <td>{value.cstate}</td>
      <td>{value.shortname}</td>
      <td>{value.fullname}</td>
      <td>{value.legalname}</td>
   </tr>
);

const FrmList = ({
  onClick,
  dataList
}) => (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
      <td>cState</td>
      <td>shortName</td>
      <td>fullName</td>
      <td>legalName</td>
      </tr>
    </thead>
    <tbody>
        { dataList.map((rValue,rIndex) => (
           <FrmListRow 
              key={rValue.pid}
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
    gate.post('/api/person', postData)
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
    <h1>Персона</h1>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmedit-cstate">
      <Col componentClass={ControlLabel} sm={2}>
        CState
      </Col>
      <Col sm={4}>
        <StateLookup
           value={data.cstate}  
           onChange={(event) => onChange(event,"cstate")} 
           mandatory={false}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmedit-shortname">
      <Col componentClass={ControlLabel} sm={2}>
        ShortName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.shortname || "shortname"}
           value={data.shortname || ""}
           onChange={(event) => onChange(event,"shortname",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmedit-fullname">
      <Col componentClass={ControlLabel} sm={2}>
        FullName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.fullname || "fullname"}
           value={data.fullname || ""}
           onChange={(event) => onChange(event,"fullname",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="D9E27545-D15C-4C8B-959A-7A74C3D8C9D3-frmedit-legalname">
      <Col componentClass={ControlLabel} sm={2}>
        LegalName
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.legalname || "legalname"}
           value={data.legalname || ""}
           onChange={(event) => onChange(event,"legalname",)} 
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
        pid: this.props.params.pid
      }
    }
    gate.post('/api/person', postData)
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
    gate.post('/api/person', postData)
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
    gate.post('/api/person', postData)
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