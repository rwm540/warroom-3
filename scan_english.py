import os, re

ignore_words = {'div', 'span', 'button', 'input', 'form', 'img', 'svg', 'path', 'motion', 'true', 'false', 'null', 'undefined', 'className', 'onClick', 'onChange', 'onSubmit', 'type', 'id', 'name', 'value', 'placeholder', 'title', 'key', 'ref', 'style', 'src', 'alt', 'initial', 'animate', 'exit', 'transition', 'whileTap', 'whileHover', 'layoutId', 'dangerouslySetInnerHTML', 'disabled', 'checked', 'selected', 'hidden', 'required', 'readOnly', 'autoFocus', 'autoComplete', 'target', 'rel', 'href', 'role', 'aria', 'xmlns', 'viewBox', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'd', 'import', 'export', 'const', 'let', 'var', 'function', 'return', 'interface', 'default', 'from', 'as', 'async', 'await', 'try', 'catch', 'finally', 'new', 'class', 'extends', 'implements', 'typeof', 'instanceof', 'void', 'string', 'number', 'boolean', 'any', 'never', 'unknown', 'record', 'map', 'filter', 'reduce', 'find', 'some', 'every', 'includes', 'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'join', 'split', 'replace', 'trim', 'toLowerCase', 'toUpperCase', 'startsWith', 'endsWith', 'substring', 'substr', 'indexOf', 'lastIndexOf', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'Math', 'floor', 'ceil', 'round', 'min', 'max', 'random', 'abs', 'Date', 'now', 'toISOString', 'getTime', 'getFullYear', 'getMonth', 'getDate', 'JSON', 'stringify', 'parse', 'localStorage', 'getItem', 'setItem', 'removeItem', 'clear', 'sessionStorage', 'document', 'window', 'navigator', 'console', 'log', 'warn', 'error', 'info', 'debug', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'addEventListener', 'removeEventListener', 'Set', 'add', 'delete', 'has', 'size', 'Array', 'isArray', 'from', 'of', 'Object', 'keys', 'values', 'entries', 'assign', 'freeze', 'Promise', 'all', 'resolve', 'reject', 'then', 'catch', 'finally', 'supabase', 'from', 'select', 'insert', 'update', 'delete', 'upsert', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'is', 'order', 'limit', 'range', 'single', 'maybeSingle', 'storage', 'upload', 'download', 'getPublicUrl', 'data', 'error', 'count', 'status', 'statusText', 'props', 'state', 'setState', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext', 'lazy', 'Suspense', 'lucide', 'react', 'tailwind', 'vite', 'flex', 'grid', 'text', 'bg', 'border', 'rounded', 'shadow', 'font', 'gap', 'w', 'h', 'p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr', 'top', 'bottom', 'left', 'right', 'z', 'opacity', 'cursor', 'duration', 'ease', 'delay', 'sticky', 'fixed', 'absolute', 'relative', 'overflow', 'justify', 'items', 'col', 'row', 'sm', 'md', 'lg', 'xl', '2xl', 'dir', 'rtl', 'ltr'}

results = []
for root, dirs, files in os.walk('src'):
    for f in sorted(files):
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
                for line_no, line in enumerate(lines, 1):
                    # Check JSX text
                    matches = re.findall(r'>([^<>{}]*[A-Za-z]{2,}[^<>{}]*)<', line)
                    for m in matches:
                        clean_words = [w for w in re.findall(r'[A-Za-z]{2,}', m) if w.lower() not in ignore_words]
                        if clean_words:
                            results.append((path, line_no, m.strip(), clean_words))

print(f"Total occurrences: {len(results)}")
for path, line_no, text, words in results:
    print(f"{path}:{line_no} -> {text} (Words: {words})")
