import React from "react";
import Pagination from "./Pagination.js";

import debounce from "lodash/debounce";

class Table extends React.Component {
  state = {
    sortColumn: null,
    sortAsc: true,
    query: "",
    visibleQuery: "",
    perPage: 10,
    page: 1,
    countCheckButton: 0,
  };

  handleQueryChange = event => {
    this.setState({
      visibleQuery: event.target.value
    });
    this.updateQuery(event.target.value);
  };

  updateQuery = debounce(query => {
    this.setState({
      query: query,
      page: 1
    });
  }, 500);

  handleHeaderClick = (key) => {
  
    if (!this.props.config[key].isSortable) {
      return;
    }

    this.setState(({ sortColumn, sortAsc }) => {
      return {
        sortColumn: key,
        sortAsc: sortColumn === key ? !sortAsc : true
      };
    });
  };

  handleItemInput = (event, item) => {
    const { items } = this.props;
    items[item.id].note = event.target.value;

    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  sortItems = ({ items, sortColumn, sortAsc }) => {
    if (!sortColumn) {
      return items;
    }

    const sign = sortAsc ? 1 : -1;
    const sortFn =
      typeof items[0][sortColumn] === "number"
        ? (a, b) => sign * (a[sortColumn] - b[sortColumn])
        : (a, b) => sign * a[sortColumn].localeCompare(b[sortColumn]);
    return [...items].sort(sortFn);
  };

  filterItems = ({ items, query }) => {
    const queryRegexp = new RegExp(query, "i");
    return items.filter(item => queryRegexp.test(item.name));
  };

  paginateItems = ({ items, perPage, page }) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
  };

  checkedItems = ({ items }) => {
    const { countCheckButton } = this.state;

    if(countCheckButton%2 === 0) {
      return items;
    } else {
      return items.filter(item => item.checked);
    }
  }

  handlePerPageChange = event => {
    this.setState({
      perPage: +event.target.value,
      page: 1
    });
  };

  handlePageChange = page => {
    this.setState({ page });
  };

  handleCheckedStatus = (event, item) => {
    const { items } = this.props;
    
    if(event.target.type !== 'checkbox') {
      return ;
    }
    if(!items[item.id].checked) {
      items[item.id].checked = true
    } else {
      items[item.id].checked = false
    }
  }

  handleButtonClick = ( items ) => {
    const { countCheckButton } = this.state;

    this.setState({
      countCheckButton: countCheckButton + 1,
    });
  }



  render() {
    const {
      page,
      perPage,
      query,
      visibleQuery,
      sortColumn,
      sortAsc,
      countCheckButton,
    } = this.state;
    const { items, config } = this.props;

    const sortedItems = this.sortItems({
      items,
      sortColumn,
      sortAsc
    });

    const filteredItems = this.filterItems({
      items: sortedItems,
      query
    });

    const paginatedItems = this.paginateItems({
      items: filteredItems,
      page,
      perPage
    });

    const visibleItems = this.checkedItems({
      items: paginatedItems,
    });


    return (
      <div className="Table-App">
        <div className="Table-App_Menu">
          <h3>data table with some people</h3>
          <div>
            <button onClick={this.handleButtonClick}>
              {countCheckButton%2===0 ? 'Show checked' : 'Show All'}
            </button>
            <input
              type="text"
              placeholder="Search"
              value={visibleQuery}
              onChange={this.handleQueryChange}
            />
          </div>
        </div>

        <table className="Table-App_Table">
          <thead className="Table-App_Table-header">
            <tr>
              {Object.entries(config).map(([key, value]) => (
                <th
                  key={key}
                  className={`Table-cell dark-border ${config[key].isSortable ? "sortable-column" : ""}`}
                  onClick={() => this.handleHeaderClick(key)}
                >
                  {value.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleItems.map(item => (
              <tr 
                key={item.id} 
                className="Table-App_Table-row"
              >
                {Object.keys(config).map(key => (
                  <td 
                    key={key} 
                    className="Table-cell"
                    onKeyPress={event => this.handleItemInput(event, item)}
                    onChange={event => this.handleCheckedStatus(event, item)}
                  >
                    {config[key].render ? config[key].render(item) : item[key]} 
                  </td>
                ))}
            </tr>
            ))}
          </tbody>
        </table>


        <div className='Table-App_Footer'>
          <div>
            <h4>People per page:</h4>
            <select onChange={this.handlePerPageChange} value={this.state.perPage}>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </div>

          <Pagination
            page={page}
            perPage={perPage}
            totalCount={filteredItems.length}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}





export default Table;
