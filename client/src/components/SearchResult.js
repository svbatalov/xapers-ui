import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { URL } from '../actions';
import Progress from 'react-circular-progressbar';
import 'react-circular-progressbar/docs/styles.css';

@observer
export default class SearchResult extends React.Component {
  onClick = () => {
    const { item, history } = this.props;
    history.push(`/${item.id}`, { item: toJS(item) });
  }

  render () {
    const { bib={}, tags=[], id, matchp } = this.props.item;
    let {
      authors=[],
      title='<???>',
      journal='<???>',
      number='',
      volume='<???>',
      year='???',
      pages='' } = bib || {};
    const authorsString = (authors||[]).join('; ');
    const journalString = `${journal}, ${number} (${volume}), P${pages}, ${year}`;
    return (
      <div className="search_result_container" onClick={this.onClick}>
        <table>
          <tbody>

            <tr>
              <td>id:</td>
              <td>{id}</td>
            </tr>

            <tr>
              <td>Title:</td>
              <td>
                <a
                  href={`${URL}/id/${id}`}
                  onClick={e => e.stopPropagation()}
                  download
                >
                  {title || '<No title>'}
                </a>
              </td>
            </tr>

            <tr>
              <td>Authors:</td>
              <td>{authorsString}</td>
            </tr>

            <tr>
              <td>Journal:</td>
              <td>{journalString}</td>
            </tr>

            <tr>
              <td>Tags:</td>
              <td>{tags.join(', ')}</td>
            </tr>

          </tbody>
        </table>
        <div className="progressContainer">
          <Progress
            percentage={matchp}
            classForPercentage={p => p < 90 ? 'incomplete' : 'complete' }
          />
        </div>
      </div>
    );
  }
}
