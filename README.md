# Shared Codefresh Steps

Collection of steps I've been working on that can be of use to others.

# Steps

## SSM-To-YAML

Converts all SSM parameters in a path to a YAML object of name-value pairs. These can then be used in a Kubernetes secret like so (The primary use case for this tool - not saying you have to use it this way):

```yaml
api: v1
kind: Secret
# Metadata etc.
stringData:
{{- range .Values.mysecrets.secrets }}
  {{ .name | quote }}: {{ .value | quote }}
{{- end }}
```

