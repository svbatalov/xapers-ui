import React from 'react';
import PropTypes from 'prop-types';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

const toValueLabel = el => ({ value: el, label: el });
const fromValueLabel = el => el.value;

export default class TagSelect extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    get_options: PropTypes.func,
    className: PropTypes.string,
  }

  defaultProps = {
    value: [],
    className: "",
  }

  state = {
    loading: false,
    options: [],
  }

  onChange = (selected) => {
    this.props.onChange(selected.map(fromValueLabel));
  }

  componentDidMount() {
    const { get_options } = this.props;
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
    const { value, onChange, className } = this.props;

    return (
      <Creatable
        className={className}
        isLoading={this.state.loading}
        multi
        value={value.map(toValueLabel)}
        options={this.state.options}
        ignoreCase={false}
        onChange={this.onChange}
        shouldKeyDownEventCreateNewOption={({ keyCode }) => keyCode === 13 /*ENTER*/ || keyCode === 9 /*TAB*/ }
      />
    );
  }
}
