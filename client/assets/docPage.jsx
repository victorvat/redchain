import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import gate from '../lib/gate';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Table } from 'react-bootstrap';
import DocSpecLookup from './docSpecLookup.jsx';
import StateLookup from './stateLookup.jsx';
import OpenBtn from '../components/openBtn.jsx';

const FrmFind = ({
  onSubmit,
  onChange,
  data
}) => (
  <Form horizontal onSubmit={ onSubmit }>
      <h1>Документ</h1>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_cSpec">
      <Col componentClass={ControlLabel} sm={2}>
        CSpec
      </Col>
      <Col sm={10}>
        <DocSpecLookup
           value={data.cspec}  
           onChange={(event) => onChange(event,"cspec")}
           mandatory={false}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_cState">
      <Col componentClass={ControlLabel} sm={2}>
        CState
      </Col>
      <Col sm={2}>
        <StateLookup
           value={data.cstate}  
           onChange={(event) => onChange(event,"cstate")}
           mandatory={false}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_docN">
      <Col componentClass={ControlLabel} sm={2}>
        DocN
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docn || "docn"}
           value={data.docn || ""}
           onChange={(event) => onChange(event,"docn",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_docDate">
      <Col componentClass={ControlLabel} sm={2}>
        DocDate
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docdate || "docdate"}
           value={data.docdate || ""}
           onChange={(event) => onChange(event,"docdate",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_docEnd">
      <Col componentClass={ControlLabel} sm={2}>
        DocEnd
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docend || "docend"}
           value={data.docend || ""}
           onChange={(event) => onChange(event,"docend",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmfind_docAuth">
      <Col componentClass={ControlLabel} sm={2}>
        DocAuth
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docauth || "docauth"}
           value={data.docauth || ""}
           onChange={(event) => onChange(event,"docauth",)} 
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
   <tr onClick={(event)=>onClick(event, value.cdoc)}>
      <td>{value.cspec}</td>
      <td>{value.cstate}</td>
      <td>{value.docn}</td>
      <td>{value.docdate}</td>
      <td>{value.docend}</td>
      <td>{value.docauth}</td>
   </tr>
);

const FrmList = ({
  onClick,
  dataList
}) => (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
      <td>cSpec</td>
      <td>cState</td>
      <td>docN</td>
      <td>docDate</td>
      <td>docEnd</td>
      <td>docAuth</td>
      </tr>
    </thead>
    <tbody>
        { dataList.map((rValue,rIndex) => (
           <FrmListRow 
              key={rValue.cdoc}
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
    gate.post('/api/doc', postData)
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
    browserHistory.push('/d/doc/edit/'+key);
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
    <h1>Документ</h1>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-cspec">
      <Col componentClass={ControlLabel} sm={2}>
        CSpec
      </Col>
      <Col sm={10}>
        <DocSpecLookup
           value={data.cspec}  
           onChange={(event) => onChange(event,"cspec")} 
           mandatory={false}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-cstate">
      <Col componentClass={ControlLabel} sm={2}>
        CState
      </Col>
      <Col sm={2}>
        <StateLookup
           value={data.cstate}  
           onChange={(event) => onChange(event,"cstate")} 
           mandatory={true}
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-docn">
      <Col componentClass={ControlLabel} sm={2}>
        DocN
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docn || "docn"}
           value={data.docn || ""}
           onChange={(event) => onChange(event,"docn",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-docdate">
      <Col componentClass={ControlLabel} sm={2}>
        DocDate
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docdate || "docdate"}
           value={data.docdate || ""}
           onChange={(event) => onChange(event,"docdate",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-docend">
      <Col componentClass={ControlLabel} sm={2}>
        DocEnd
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docend || "docend"}
           value={data.docend || ""}
           onChange={(event) => onChange(event,"docend",)} 
        />
      </Col>
    </FormGroup>

    <FormGroup controlId="41F5F6FB-2EF4-4D55-BE43-DF2A86F4EE2C-frmedit-docauth">
      <Col componentClass={ControlLabel} sm={2}>
        DocAuth
      </Col>
      <Col sm={10}>
        <FormControl type="text" 
           placeholder={data.docauth || "docauth"}
           value={data.docauth || ""}
           onChange={(event) => onChange(event,"docauth",)} 
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
        <Button href="/d/doc/find">
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
        cdoc: this.props.params.cdoc
      }
    }
    gate.post('/api/doc', postData)
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
    gate.post('/api/doc', postData)
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
    gate.post('/api/doc', postData)
    .then( response => {
      console.log('got', response.meesage);
      alert(response.meesage);      
      browserHistory.push('/d/doc/find');
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