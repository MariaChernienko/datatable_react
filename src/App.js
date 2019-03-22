import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Table from './components/Table.js';

import './App.css';

const peopleColConfig = {
  checkbox: {
    title: '',
  },
  name: {
    title: 'Name', 
    isSortable: true, 
    isSearchable: true,
    render: (person) => (
      <Link to={`/people/${person.name}`}>{person.name}</Link>
    )
  },
  born: {
    title: 'Date of Birth',
    isSortable: true, 
  },
  age: {
    title: "Age",
    render: (person) => person.died - person.born,
  },
  sex: { 
    title: 'Gender',
  },
  note: {
    title: 'Note',
    render: () => <input />
  }
};

class App extends Component {
  
  state = {
    people:[], 
    config: peopleColConfig,
  };

  async componentDidMount() {
    const responce = await fetch('https://mate-academy.github.io/fe-program/js/tasks/people/people.json');
    const people = await responce.json();
     
    this.setState({
      people: people.map((person, id) => {
        return { ...person, id: id, checked: false, note: "" };
      }),
    });
  }

  render() {
    const { people, config } = this.state;
    return (
      <div className="App">
        <Table items={people} config={config}/>
      </div>
    );
  }
}

export default App;
