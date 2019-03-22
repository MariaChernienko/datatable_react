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
    allItemsChecked: false,
  };

  handleQueryChange = event => {
    this.setState({
      visibleQuery: event.target.value
    });
    this.updateQuery(event.target.value);
  };

  updateQuery = debounce(query => {
    this.setState({
      query,
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

  handleHeaderInput = ( status ) => {
    const { items } = this.props;
    items.map(item => item.checked = status)

    this.setState({
      items
    });
  }

  checkedItems = ({ items }) => {
    const { allItemsChecked } = this.state;

    if(!allItemsChecked) {
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

  handleCheckedStatus = (item, status) => {
    const { items } = this.props;
    items[item.id].checked = status;

    this.setState({
      items
    });
  }

  handleButtonClick = () => {
    const { allItemsChecked } = this.state;

    this.setState({
      allItemsChecked: !allItemsChecked,
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
      allItemsChecked,
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
              { allItemsChecked ? 'Show All' : 'Show checked' }
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
                  {key==='checkbox' ? <input type="checkbox" value="" onChange={(event) => this.handleHeaderInput(event.target.checked)}/> : value.title}
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
                  >
                    {key ==='checkbox' && <input type="checkbox" checked={item.checked} onChange={(event) => this.handleCheckedStatus(item, event.target.checked)} />}
                    {config[key].render ? config[key].render(item) : item[key]} 
                  </td>
                ))}
            </tr>
            ))}
          </tbody>
        </table>


        <div className='Table-App_Footer'>
          <div>
            <h4>people per page:</h4>
            <select className="Items-perpage" onChange={this.handlePerPageChange} value={this.state.perPage}>
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
