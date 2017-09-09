import React from 'react';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

const toValueLabel = el => ({ value: el, label: el });
const fromValueLabel = el => el.value;

export default class Multiselect extends React.Component {
  state = {
    loading: false,
    options: [],
  }

  onChange = (selected) => {
    this.props.onChange(selected.map(fromValueLabel));
  }

  componentDidMount() {
    const { uiSchema: { 'ui:options': { get_options } } } = this.props;
    if (typeof(get_options) !== 'function') return;

    this.setState({ loading: true })
    get_options().then(opts => {
      this.setState({
        loading: false,
        options: opts.map(toValueLabel),
      })
    });

  }

  render() {
    const { formData = {}, onChange, schema } = this.props;
    const value = formData.map(toValueLabel);

    console.log('formData', formData, this.props, value);
    return (
      <div className="multiselect-form-control">
        {/*
        
        <label>
          {schema.title}
        </label>
          */}
        <Creatable
          className1="form-control"
          isLoading={this.state.loading}
          multi
          value={value}
          options={this.state.options}
          ignoreCase={false}
          onChange={this.onChange}
          shouldKeyDownEventCreateNewOption={({ keyCode }) => keyCode === 13 /*ENTER*/ || keyCode === 9 /*TAB*/ }
        />
      </div>
    );
  }
}
