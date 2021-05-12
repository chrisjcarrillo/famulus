class Utils {
    getQueryString() {
      const pairs = location.search.slice(1).split('&');
  
      let result = {};
      pairs.forEach(function(pair) {
        const pairSplited = pair.split('=');
        result[pairSplited[0]] = decodeURIComponent(pairSplited[1] || '');
      });
  
      return JSON.parse(JSON.stringify(result));
    }
  }
  
  const utils = new Utils();
  export default utils;
  