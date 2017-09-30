import React from 'react';
import { observer, inject } from 'mobx-react';
import { save_retry, search, get_tags } from '../actions';
import TagSelect from './TagSelect';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

function Tpl(props) {
  const {id, label, required, children} = props;
  return (
    <div className="myfield">
      <label htmlFor={id}>{label}{/*required ? "*" : null*/}</label>
      {children}
    </div>
  );
}

@inject('store')
@observer
export default class EditPanel extends React.Component {
  state = { item: null, initialItem: null }

  componentDidMount() {
    const { store, match, location } = this.props;

    search({ q: `id:${match.params.id}` })
    .then( res => {
      if (!res || !res[0]) return;
      const item = res[0];
      this.setState({ item, initialItem: clone(item) });
    });
  }

  onSubmit = (ev) => {
    ev.preventDefault();
    console.log('SUBMIT', this.state.item);
    save_retry(this.state.item);
    this.props.history.goBack();
  }

  onBibtexChange = (ev, ...rest) => {
    const item = this.state.item;
    if (!item) return;
    item.bibtex = ev.target.value;
    this.setState({ item })
  }

  onTagsChange = (tags) => {
    const item = this.state.item;
    if (!item) return;
    item.tags = tags;
    this.setState({ item })
  }

  onReset = () => {
    this.setState({item: clone(this.state.initialItem) });
    this.props.history.goBack();
  }

  render() {
    const data = this.state.item;
    const { bibtex, tags } = data || { tags: [] };
    return (
      <div className="edit-panel">

        <h2>Edit document details</h2>

        <form>
          <label>
            Bibtex
          </label>
          <textarea
            value={bibtex}
            rows={15}
            cols={100}
            onChange={this.onBibtexChange}
          />

          <label>
            Tags
          </label>
          <TagSelect
            value={tags}
            get_options={get_tags}
            onChange={this.onTagsChange}
          />

        <button type="submit" onClick={this.onSubmit}>Submit</button>
        <button type="button" onClick={this.onReset}>Cancel</button>

      </form>
    </div>
    );
  }
}
