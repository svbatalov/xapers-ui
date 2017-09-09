import React from 'react';
import { observer, inject } from 'mobx-react';
import cn from 'classnames';

const SortDir = observer(({ store }) => (
  <span>{store.sortDir ? (<span>&uArr;</span>) : (<span>&dArr;</span>)}</span>
));

@inject('store')
@observer
export default class Sort extends React.Component {
  onClick = (sortBy) => () => {
    const { store } = this.props;
    console.log('SortBy', sortBy);
    if (sortBy === store.sortBy) {
      store.sortDir = !store.sortDir;
    }
    store.sortBy = sortBy;
  };

  render () {
    const { results, sortBy } = this.props.store;
    const count = results.length;
    return (
      <div className="sort">
        <span className="highlitedText">Sort by&nbsp;</span>
        <div
          onClick={this.onClick('id')}
          className={cn({selected: sortBy == 'id'})}
        >
          ID
          <SortDir store={store} />
        </div>
        <div
          onClick={this.onClick('relevance')}
          className={cn({selected: sortBy == 'relevance'})}
        >
          Relevance
          <SortDir store={store} />
        </div>
        <div
          onClick={this.onClick('year')}
          className={cn({selected: sortBy == 'year'})}
        >
          Year
          <SortDir store={store} />
        </div>
      </div>
    );
  }
}
