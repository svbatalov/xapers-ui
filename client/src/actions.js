import qs from 'qs';
import Retry from 'promise-retry';

export const URL = '//localhost:5000/';

export function query({q={}, baseURL=URL, pathname='', headers={}, retry=true}) {
  const queryObject = typeof(q) === 'object' ? q : { q };
  const queryString = qs.stringify(queryObject);
  return Retry((doretry, number) => {
    console.log('Retry', number);
    return fetch(`${baseURL}/${pathname}${queryString && '?'}${queryString}`, {
      headers: { Accept: 'application/json', ...headers },
    })
    .then(r => r.json())
    .then(({items}) => items)
    .catch(() => retry && doretry());
  })
}

export function search (store, q) {
  return query({ q })
  .then(items => {
    store.results.replace(items);
    return items;
  });
}

export function get_terms(prefix) {
  return query({ pathname: `term/${encodeURIComponent(prefix)}` });
};

export function get_tags(prefix='') {
  return query({ pathname: `tags/${prefix}` });
}

export function save(data) {
  if (!data.id) return;
  return fetch(`${URL}/id/${data.id}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function save_retry(data) {
  return Retry((retry, number) => save(data).catch(retry));
}
