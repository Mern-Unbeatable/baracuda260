import json
import re
import os

with open('lint-results.json', 'r') as f:
    results = json.load(f)

for result in results:
    filepath = result['filePath']
    messages = result['messages']
    
    if not any(m['severity'] == 2 for m in messages):
        continue
        
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    changed = False
    
    # Sort messages in reverse line order so line numbers don't shift
    messages = sorted(messages, key=lambda x: x['line'], reverse=True)
    
    for msg in messages:
        if msg['severity'] != 2: continue
        line_idx = msg['line'] - 1
        col_idx = msg['column'] - 1
        rule = msg.get('ruleId', '')
        
        if rule == 'no-unused-vars':
            match = re.search(r"'([^']+)'", msg['message'])
            if match:
                var_name = match.group(1)
                line = lines[line_idx]
                
                # Case 1: Function argument (e.g., onSubmit = (data) => )
                if "is defined but never used. Allowed unused args" in msg['message']:
                    # Simple replace for data -> _data
                    if re.search(r'\b' + var_name + r'\b', line):
                        lines[line_idx] = re.sub(r'\b' + var_name + r'\b', '_' + var_name, line)
                        changed = True
                        
                # Case 2: Unused caught error
                elif "is defined but never used. Allowed unused caught errors" in msg['message']:
                    if re.search(r'\b' + var_name + r'\b', line):
                        lines[line_idx] = re.sub(r'\b' + var_name + r'\b', '_' + var_name, line)
                        changed = True
                        
                # Case 3: Unused import
                elif line.strip().startswith('import '):
                    # Remove the variable from the destructured import
                    new_line = re.sub(r'\b' + var_name + r'\s*,\s*', '', line)
                    new_line = re.sub(r',\s*' + var_name + r'\b', '', new_line)
                    new_line = re.sub(r'\{\s*' + var_name + r'\s*\}', '{}', new_line)
                    
                    if new_line != line:
                        lines[line_idx] = new_line
                        changed = True
                        
                    # If it resulted in import {} from ..., remove the whole line
                    if re.search(r'import\s*\{\s*\}\s*from', lines[line_idx]):
                        lines[line_idx] = ''
                        
                # Case 4: Unused assignment (e.g. const { control } = useForm())
                else:
                    new_line = re.sub(r'\b' + var_name + r'\s*,\s*', '', line)
                    new_line = re.sub(r',\s*' + var_name + r'\b', '', new_line)
                    new_line = re.sub(r'\{\s*' + var_name + r'\s*\}', '{}', new_line)
                    if new_line != line:
                        lines[line_idx] = new_line
                        changed = True
    
    if changed:
        with open(filepath, 'w') as f:
            f.writelines(lines)
        print(f"Fixed {filepath}")
