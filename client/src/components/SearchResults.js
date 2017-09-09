import React from 'react';
import { observer, inject } from 'mobx-react';

import SearchResult from './SearchResult';

@inject('store')
@observer
export default class Search extends React.Component {
  sort = (items) => {
    const { sortBy, sortDir } = this.props.store;
    const dir = sortDir ? 1 : -1;
    switch (sortBy) {
      case 'id': return items.sort((a,b) => dir * (a.id - b.id));
      case 'relevance': return items.sort((a,b) => dir * (a.matchp - b.matchp));
      case 'year': return items.sort((a,b) => (
              (a.bib && b.bib) && dir * (a.bib.year - b.bib.year) || -1
      ));
    }
  }

  render () {
    const { store } = this.props;
    return (
      <div className="search_results_container">
        { store.results && store.results.length ?
          this.sort(store.results).map(r => <SearchResult {...this.props} item={r} key={r.id} />)
          :
          <div className="search_result_container no_result">
            Sorry, no results yet
          </div>
        }
      </div>
    );
  }
}
