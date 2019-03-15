import React from 'react';

class Pagination extends React.Component {

  createBtns = (n) => {
    let btns = []
    for (let i = 1; i <= n; i++) {
      btns.push(<span key={i}><button onClick={(event) => this.props.onPageChanged(event, i)}>{i}</button></span>)
    }
    return btns;
  };


  render() {
    const { totalRecords, perPage } = this.props;
   
    const countPages = (Math.ceil(totalRecords/10)) / perPage * 10;

    return (
      <div className="Pagination">
        {this.createBtns(countPages)}
      </div>
    )
  }
}
export default Pagination;