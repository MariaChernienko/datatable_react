import React from "react";
import TableContext from './TableContext.js';
import Pagination from './Pagination.js';

// import debounce from 'lodash.debounce';

const TableHeader = ({ config, handleHeaderClick }) => {
  return (
    <thead>
      <tr>
        {Object.entries(config).map(([key, value]) => (
          <th key={key} className={config[key].isSortable ? 'sortable-column' : ''}
            onClick={() => handleHeaderClick(key)}
          >
            {value.title}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const Cell = ({ item, column, render }) => (

  <TableContext.Consumer>
    {handleItemInput => (
      <td onKeyPress={(event) => handleItemInput(event, item)}>
        {render ? render(item) : item[column]}
      </td>
    )}
  </TableContext.Consumer>
);

const Row = ({ item, config }) => (
  <tr>
    {Object.keys(config).map(key => (
      <Cell key={key} item={item} column={key} render={config[key].render} />
    ))}
  </tr>
);

const TableContent = ({ items, config }) => {
  return (
    <tbody>
      {items.map(item => (
        <Row key={item.name} item={item} config={config} />
      ))}
    </tbody>
  );
};


class Table extends React.Component {
  state = {
    sortColumn: null,
    sortAsc: true,
    query: '',
    currentPeople: [],
    // currentPage: null,
    // totalPages: null,
    perPage: 10,
  };


  handleInputChange = (event) => {
    this.setState({
      query: event.target.value,
    });
  };

  handleHeaderClick = (key) => {
    if(!this.props.config[key].isSortable) {
      return;
    }
  
    this.setState(({ sortColumn, sortAsc }) => {
      return {
        sortColumn: key,
        sortAsc: sortColumn === key ? !sortAsc : true,
      }
    });
  };

  handleItemInput = (event, item) => {
    const { items } = this.props;
    items[item.id].note = event.target.value;

    if(event.key === "Enter") {
      event.target.blur();
    }
  };

  getSortedItems = () => {
    const { sortColumn, sortAsc, query } = this.state;
    const { items } = this.props;

    if(!sortColumn) {
      return items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    const sign = sortAsc ? 1 : -1;
    const sortFn = typeof items[0][sortColumn] === 'number'
      ? (a, b) => sign * (a[sortColumn] - b[sortColumn])
      : (a, b) => sign * a[sortColumn].localeCompare(b[sortColumn])
    ;
    return items.sort(sortFn).filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };

  onPageChanged = (event, i) => {
    console.log(event, i);

    const { items } = this.props;
    const { perPage} = this.state;

    console.log(items.filter(item => item.id > i * perPage));
    return items.filter(item => item.id > i * perPage);


  }



 

  render() {
    const { config } = this.props;
    // const { currentPeople, currentPage, totalPages} = this.state;
    const { perPage } = this.state;
    const sortedItems =  this.getSortedItems();
    const totalPeople = sortedItems.length;
    

    return (
      <div className="Table">
        <input onChange={(event) => this.handleInputChange(event)}/>
        <table>
          <TableHeader config={config} handleHeaderClick={this.handleHeaderClick}/>

          <TableContext.Provider value={this.handleItemInput}>
            <TableContent items={sortedItems} config={config} />
          </TableContext.Provider>
        </table>
        <Pagination 
          totalRecords={totalPeople}
          perPage={perPage}
          onPageChanged={this.onPageChanged} 
        />
      </div>
    );
  }
}

export default Table;
