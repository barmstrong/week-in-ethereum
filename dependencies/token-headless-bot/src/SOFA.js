const glob = require("glob")
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

class SOFAObject {
  constructor(name, schema, content) {
    this.name = name;
    this.schema = schema;
    this.content = content;

    let ajv = new Ajv();
    this.validate = ajv.compile(schema);
    var valid = this.validate(content);
    //if (!valid) console.log(ajv.errorsText());
  }

  get type() {
    return this.name;
  }

  get json() {
    return JSON.stringify(this.content);
  }

  get prefix() {
    return 'SOFA::'+this.name+':'
  }

  get string() {
    return this.prefix + this.json;
  }

  get display() {
    return "";
  }
}


class SOFA  {
  constructor() {
    this.schemas = {};
    let root = path.resolve(__dirname, '../vendor/token-sofa-spec/schema');
    let schemaPaths = glob.sync(path.join(root,'*.json'));
    for (let schemaPath of schemaPaths) {
      let name = path.basename(schemaPath, '.json');
      let schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      this.addSchema(name, schema);
    }
  }

  addSchema(name, schema) {
    this.schemas[name] = schema;
    this[name] = function(content) {
      if (content) {
        return new SOFAObject(name, schema, content);
      } else {
        return "SOFA::"+name+":";
      }
    }
  }

  parse(s) {
    let sofaRx = new RegExp(/^\s*SOFA::(\w+):({.+})/g);
    let match = sofaRx.exec(s);
    let name = match[1];
    let content = JSON.parse(match[2]);
    return this[name](content);
  }
}

module.exports = new SOFA();
