const yaml = require('js-yaml');
const aws = require('aws-sdk');
const fs   = require('fs');

const SSM_PATH = process.env.SSM_PATH;
const YAML_OUTPUT_PATH = process.env.YAML_OUTPUT_PATH;

const getSSMValues = (path) => {
    const ssm = new aws.SSM();
    ssm.getParametersByPath({
        Path: path,
        Recursive: true,
        WithDecryption: false
    }, (err, data) => {
        if (err) {
            console.log('Error retrieving SSM data');
            console.log(err.message);
        }
        const output = {
            secrets: []
        };
        data.Parameters.forEach((el) => {
            output.secrets.push({
                name: el.Name.replace(SSM_PATH, '').replace('/', ''),
                value: el.Value
            });
        });
        fs.writeFileSync(YAML_OUTPUT_PATH, yaml.safeDump(output), { flag: 'wx' });
    });
}

getSSMValues(SSM_PATH);