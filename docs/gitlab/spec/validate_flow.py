import json
import yaml
import jsonschema

# Load official GitLab JSON Schema for Flow Registry v1
schema_path = "products/sponsorfit/docs/gitlab/spec/flow_config.schema.json"
with open(schema_path, "r", encoding="utf-8") as f:
    schema = json.load(f)

# Load rewritten honesty-guard.yaml
flow_path = "products/sponsorfit/.gitlab/duo/flows/honesty-guard.yaml"
with open(flow_path, "r", encoding="utf-8") as f:
    flow_data = yaml.safe_load(f)

print(f"Validating {flow_path} against {schema_path}...")
try:
    jsonschema.validate(instance=flow_data, schema=schema)
    print("\n-------------------------------------------------------------")
    print("RESULT: PASSED (100% VALID)")
    print("The flow definition strictly conforms to Flow Registry v1 schema!")
    print("-------------------------------------------------------------")
    print(f"Root keys present: {list(flow_data.keys())}")
    print(f"Environment: {flow_data.get('environment')}")
    print(f"Entry point: {flow_data.get('flow', {}).get('entry_point')}")
    print(f"Components ({len(flow_data.get('components', []))}): {[c.get('name') + ' (' + c.get('type') + ')' for c in flow_data.get('components', [])]}")
    print(f"Routers ({len(flow_data.get('routers', []))}): {[r.get('from') + ' -> ' + (r.get('to') or str(list(r.get('condition', {}).get('routes', {}).keys()))) for r in flow_data.get('routers', [])]}")
    print(f"Prompts ({len(flow_data.get('prompts', []))}): {[p.get('prompt_id') for p in flow_data.get('prompts', [])]}")
    print(f"Response Schemas ({len(flow_data.get('response_schemas', []))}): {[s.get('schema_id') for s in flow_data.get('response_schemas', [])]}")
except jsonschema.ValidationError as e:
    print("\n-------------------------------------------------------------")
    print("RESULT: FAILED")
    print(f"Validation Error: {e.message}")
    print(f"Failed at path: {list(e.path)}")
    print("-------------------------------------------------------------")
    raise
