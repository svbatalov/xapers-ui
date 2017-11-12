import React from 'react';
import { observer, inject } from 'mobx-react';
import Autocomplete from 'react-autocomplete';
import debounce from 'lodash.debounce';
import qs from 'qs';

import { search, get_terms, get_tags } from '../actions';

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

  get_prefix_and_word = (q) => {
    if (!this.input)
      return;

    const { store } = this.props;
    const query = store.query.q;
    const input = this.input.refs.input;

    const cursor = input.selectionStart;
    const match = /((\w+):)?(\w+)?$/.exec(query.substring(0,cursor)) || [];
    const [, , prefix, word ] = match;
    return [prefix, word, match];
  }

  get_completions = debounce(() => {
    const [prefix, word] = this.get_prefix_and_word();

    if (prefix === 'tag') {
      return get_tags(word)
      .then(items => this.setState({ items }));
    }

    this.setState({ items: [] });
  }, 500);

  onChange = (e) => {
    console.log('onChange', e.target.value);
    this.props.store.query.q = e.target.value;
    this.get_completions()
  };

  onSelect = (value, item) => {
    console.log('SELECT', value, item);
    const { store } = this.props;
    const q = store.query.q;
    const input = this.input.refs.input;
    input.setSelectionRange(this.cursor, this.cursor);

    const [prefix, word, match] = this.get_prefix_and_word();
    const newValue = prefix ? `${prefix}:${value}` : value;
    const start = q.substring(0, match.index);
    const end = q.substring(match.index + match[0].length);
    console.log(`AFTER SELECT: start=${start};new=${newValue};end=${end}`, match);
    store.query.q = start + newValue + end;
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

  componentDidUpdate() {
    if (this.input) {
      this.cursor = this.input.refs.input.selectionStart;
    }
  }
  render () {
    console.log(`render: cursor =`, this.cursor, this.newCursor);
    return (
      <div className="search_container">
        <form onSubmit={this.onSubmit}>
          <Autocomplete
            ref={el => this.input = el}
            autoHighlight={false}
            inputProps={{
              placeholder: "Search query, e.g. a:Author, tag:Tagname, y:2000.. limit:10 or l:10",
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
