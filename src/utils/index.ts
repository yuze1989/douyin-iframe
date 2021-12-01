import { IObjectKeys } from 'types/public';

export const getUrlOption = (url: string) => {
  if (!url) return null;
  const option: IObjectKeys = {};
  const hashes = url?.slice(url.indexOf('?') + 1)?.split('&');
  for (let i = 0, len = hashes.length; i < len; i += 1) {
    const [hash0, hash1] = hashes[i].split('=');
    option[hash0] = hash1;
  }
  return option;
};

export const test = () => {};
