import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export default class SearchCount extends React.Component {
  render () {
    const count = this.props.store.results.length;
    return (
      <div className="highlitedText">{count} results</div>
    );
  }
}
