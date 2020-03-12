FROM node:12

# These values expected to be fed in via Codefresh pipeline step params.

ENV AWS_ACCESS_KEY_ID=changeme
ENV AWS_SECRET_ACCESS_KEY=changeme
ENV AWS_REGION=us-east-1
ENV SSM_PATH=/secret
ENV YAML_OUTPUT_PATH=./test.yaml

COPY . /application
WORKDIR /application
RUN npm run build
CMD [ "node", "convert.js" ]