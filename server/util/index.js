const xml2js = require('xml2js');

const parseXML = function (xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content)=>{
      if (err) reject(err)
      else resolve(content)
    });
  })
}

module.exports = {
  parseXML
}