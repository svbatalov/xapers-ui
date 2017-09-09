import React from 'react';
import DevTools from 'mobx-react-devtools';

import Search from './Search';
import SearchResults from './SearchResults';
import ResultCount from './ResultCount';
import Sort from './Sort';
import Loading from './Loading';

const SearchPanel = (props) => (
  <div>
    <Search {...props} />
    <Sort />
    <ResultCount />
    <SearchResults {...props} />
    <Loading />
    <DevTools />
  </div>
);

export default SearchPanel;
