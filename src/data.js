import fetch from 'isomorphic-unfetch'

export const getData = async (url) => {
    console.log('fetching:' + url);
  try {
    const data = await fetch(url);
    const json = await data.json();
    //console.log('data', json)
    return json;
  } catch(e) {
    console.error("Problem", e)
    return null;
  }
}
