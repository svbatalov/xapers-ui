import React from 'react';
import { observer, inject } from 'mobx-react';
import { save_retry, query, get_tags } from '../actions';
import Multiselect from './Multiselect';
import TagSelect from './TagSelect';

import JSForm from 'react-jsonschema-form';

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const schema = {
  type: 'object',
  properties: {
    // bib: {
    //   type: 'object',
    //   title: 'Paper details',
    //   default: {},
    //   properties: {
    //     title: { type: 'string', title: 'Title', default: '' },
    //     journal: { type: 'string', title: 'Journal', default: '' },
    //     volume: { type: 'string', title: 'Volume', default: '' },
    //     year: { type: 'string', title: 'Year', default: '' },
    //     month: { type: 'string', title: 'Month', default: '' },
    //     number: { type: 'string', title: 'Number', default: '' },
    //     pages: { type: 'string', title: 'Pages', default: '' },
    //     url: { type: 'string', title: 'URL', format: 'uri', default: '' },
    //     doi: { type: 'string', title: 'DOI', default: '' },
    //     file: { type: 'string', title: 'File', default: '' },
    //     authors: { type: 'array', title: 'Authors', default: [], items: { type: 'string', default: '', } },
    //   },
    // },
    bibtex: { type: 'string', title: 'Bibtex', default: '', },
    tags: {
      type: 'array',
      title: 'Tags',
      default: [],
      "items": { "type": "string", "default": "" }
    },
  }
};

const uiSchema = {
  bibtex: {
    'ui:widget': 'textarea',
    "ui:options": {
      rows: 15,
    },
  },
  tags: {
    'ui:field': 'multiselect',
    'ui:options': {
      //label: false,
      get_options: get_tags,
    }
  },
  bib: {
    authors: {
      'ui:field': 'multiselect',
      'ui:options': {
        //label: false,
      }
    }
  }
};

const fields = {
  multiselect: Multiselect,
};

const log = (type) => console.log.bind(console, type);

function Tpl(props) {
  const {id, label, required, children} = props;
  return (
    <div className="myfield">
      {console.log('CHILDREN', children)}
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

    query({ q: `id:${match.params.id}` })
    .then( res => {
      if (!res || !res[0]) return;
      console.log('RES', res[0]);
      const item = res[0];
      this.setState({ item, initialItem: clone(item) });
    });
  }

  onSubmit = (ev) => {
    ev.preventDefault();
    console.log('SUBMIT', this.state.item);
    save_retry(this.state.item);
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

  onReset = () => this.setState({item: clone(this.state.initialItem) });

  render() {
    const data = this.state.item;
    const { bibtex, tags } = data || { tags: [] };
    console.log('HERE', data);
    return (
      <div>
        <form>
          <label>
            Bibtex
            <textarea
              value={bibtex}
              rows={15}
              cols={100}
              onChange={this.onBibtexChange}
            />
          </label>

          <TagSelect
            value={tags}
            get_options={get_tags}
            onChange={this.onTagsChange}
          />

          <div>
            <button type="submit" onClick={this.onSubmit}>Submit</button>
            <button type="button" onClick={this.onReset}>Cancel</button>
          </div>

        </form>
      </div>
    );
  }
}
