import React from 'react';
import { observer, inject } from 'mobx-react';
import Autocomplete from 'react-autocomplete';
import debounce from 'lodash.debounce';
import qs from 'qs';

import { search, get_terms } from '../actions';

// FIXME
window.get_terms = get_terms;

@inject('store')
@observer
export default class Search extends React.Component {
  state = {
    items: [],
  };

  syncWithQueryString(newProps) {
    const { store, location: { search } } = newProps;
    const query = qs.parse(search.slice(1));
    if ('?'+store.queryString === search) {
      console.log('ALREADY IN SYNC');
      return;
    }

    console.log('NEW SEARCH', store.queryString, search);
    if (query.q) {
      store.query = query;
    }
    this.onSubmit();
  }

  componentDidMount() {
    this.syncWithQueryString(this.props);
  }

  componentWillReceiveProps(newProps) {
    console.log('PROPS', newProps);
    this.syncWithQueryString(newProps);
  }

  get_completions = debounce(() => {
    const { store } = this.props;
    let word = store.query.q.split(' ').pop();
    if (!word) {
      this.setState({ items: [] });
      return;
    }

    let prefix = word.toLowerCase();
    if (prefix[prefix.length-1] == ':') {
      // Strip last colon
      prefix = prefix.substring(0, prefix.length-1);
    }
    return get_terms(prefix)
    // .then(items => items.map(i => (word + i)))
    .then(items => this.setState({ items }));
  }, 500);

  onChange = (e) => {
    console.log('onChange', e.target.value);
    this.props.store.query.q = e.target.value;
    this.get_completions()
  };

  onSelect = (value, item) => {
    console.log('SELECT', value, item);
    const { store } = this.props;
    let words = store.query.q.split(' ');
    words.pop();
    words.push(value);
    store.query.q = words.join(' ');
  };

  onSubmit = (e) => {
    console.log('Submit');
    const { store, history } = this.props;
    history.push({
      search: store.queryString,
    })
    store.progress();
    search(store.query)
    .then(res => store.results = res)
    .then(() => store.progress(false));
    e && e.preventDefault();
    this.input && this.input.blur();
  }

  render () {
    return (
      <div className="search_container">
        <form onSubmit={this.onSubmit}>
          <Autocomplete
            ref={el => this.input = el}
            autoHighlight={false}
            inputProps={{
              placeholder: "Search query, e.g. a:Author, tag:Tagname, y:2000..",
            }}
            wrapperProps={{
              className: 'autocompleteWrapper'
            }}
            value={this.props.store.query.q}
            items={this.state.items}
            getItemValue={item => item + ''}
            onSelect={this.onSelect}
            onChange={this.onChange}
            renderItem={(item, isHighlighted) => (
              <div
                className={isHighlighted ? 'highlightedItem' : 'item'}
                key={item}
              >
                {item}
              </div>
            )}
          />
          {/*
          <input
            type="text"
            placeholder="Search query, e.g. a:Author, tag:Tagname, y:2000.."
            onChange={this.onChange}
            value={this.props.store.search}
          />
          */}
        <button className="search_button" type="submit">
          Search
        </button>
      </form>
    </div>
    );
  }
}
