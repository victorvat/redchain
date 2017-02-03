import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class PersonRow extends React.Component {
   render() {
       const r = this.props.info; 
       return(
            <Panel header={r.legalName}>
                {r.fullName}
                <ListGroup fill>
                    <ListGroupItem>{r.shortName}</ListGroupItem>
                </ListGroup>                
            </Panel>
       )
   } 
}

class PersonList extends React.Component {
   render() {
       console.log(this.props.dataList);

       const dataList = this.props.dataList; 
       return(
        <Panel>
        { dataList.map((person,index) => <PersonRow info={person} key={index} />) }
        </Panel>           
       )
   } 
}

export default PersonList;