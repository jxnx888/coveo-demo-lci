import { NextRouter } from 'next/router';

export function getUrlParam(name: string, router?: NextRouter) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const urlQueries = router && router.asPath ? router.asPath.slice(8) : window.location.search.substr(1);
  const r = urlQueries.match(reg);
  if (r != null) return unescape(r[2]); return '';
}

export function updateUrlParam(name: string, value: string) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set(name, value);
  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

export function deleteUrlParam(name: string) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.delete(name);

  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
}
