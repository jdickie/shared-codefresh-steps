const yaml = require('js-yaml');
const aws = require('aws-sdk');
const fs   = require('fs');

const SSM_PATH = process.env.SSM_PATH;
const YAML_OUTPUT_PATH = process.env.YAML_OUTPUT_PATH;

const getSSMValues = async (path, token = null) => {
    const ssm = new aws.SSM();
    const options = {
        Path: path,
        Recursive: true,
        WithDecryption: false
    };
    if (token) {
        options.NextToken = token;
    }
    // Gets values on path or starts at NextToken. We only get back 10 results max even when there is
    // a MaxToken set in options - so leaving that default.
    const results = await ssm.getParametersByPath(options).promise();
    
    return results;
}

const getAllValues = async () => {
    let data = {};

    const output = {
        ssm: {
            secrets: []
        }
    };
   
    let token = 0;
    data = await getSSMValues(SSM_PATH);
    // Need to supply a NextToken - as long as this is present we're supposed to loop through results.
    while (data.NextToken) {
        data.Parameters.forEach((el) => {
            output.ssm.secrets.push({
                name: el.Name.replace(SSM_PATH, '').replace('/', ''),
                value: el.Value
            });
        });
        token = data.NextToken;
        data = await getSSMValues(SSM_PATH, token);
    }
    fs.writeFileSync(YAML_OUTPUT_PATH, yaml.safeDump(output), { flag: 'wx' });
}

getAllValues();