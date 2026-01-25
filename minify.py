#!/usr/bin/env python3
"""
Simple CSS and JS minifier for production builds
"""
import re
import sys

AUTHOR_BANNER = "/*! Authorship: Raja Nagori | Project: Nightingale Landing Page | https://nightingale-security.com/ */"

def minify_css(css_content):
    """Minify CSS by removing comments and unnecessary whitespace"""
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    # Remove extra whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    # Remove whitespace around certain characters
    css_content = re.sub(r'\s*([{}:;,])\s*', r'\1', css_content)
    # Remove trailing semicolons before closing braces
    css_content = re.sub(r';}', '}', css_content)
    # Remove leading/trailing whitespace
    css_content = css_content.strip()
    return css_content

def minify_js(js_content):
    """Minify JavaScript by removing comments and unnecessary whitespace"""
    # Remove single-line comments (but not URLs)
    js_content = re.sub(r'//.*?(?=\n|$)', '', js_content)
    # Remove multi-line comments
    js_content = re.sub(r'/\*.*?\*/', '', js_content, flags=re.DOTALL)
    # Remove extra whitespace
    js_content = re.sub(r'\s+', ' ', js_content)
    # Remove whitespace around operators (but be careful with strings)
    js_content = re.sub(r'\s*([{}();,=+\-*/])\s*', r'\1', js_content)
    # Remove leading/trailing whitespace
    js_content = js_content.strip()
    return js_content

def extract_critical_css(css_content):
    """Extract critical CSS for above-the-fold content"""
    critical_selectors = [
        r'\*\{[^}]*\}',
        r'html\{[^}]*\}',
        r'body\{[^}]*\}',
        r'\.container\{[^}]*\}',
        r'\.navbar[^{]*\{[^}]*\}',
        r'\.nav-content[^{]*\{[^}]*\}',
        r'\.logo[^{]*\{[^}]*\}',
        r'\.hero[^{]*\{[^}]*\}',
        r'\.hero-background[^{]*\{[^}]*\}',
        r'\.hero-content[^{]*\{[^}]*\}',
        r'\.hero-logo[^{]*\{[^}]*\}',
        r'\.hero-title[^{]*\{[^}]*\}',
        r'\.hero-description[^{]*\{[^}]*\}',
        r'\.hero-cta[^{]*\{[^}]*\}',
        r':root\{[^}]*\}',
        r'@keyframes[^{]*\{[^}]*\{[^}]*\}[^}]*\}',
    ]
    
    critical_css = []
    for selector in critical_selectors:
        matches = re.findall(selector + r'[^}]*\}', css_content, re.DOTALL)
        critical_css.extend(matches)
    
    return '\n'.join(critical_css)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 minify.py <input_file> <output_file> [type]")
        print("Type: css, js, or critical-css")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    file_type = sys.argv[3] if len(sys.argv) > 3 else 'css'
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if file_type == 'css':
            minified = minify_css(content)
        elif file_type == 'js':
            minified = minify_js(content)
        elif file_type == 'critical-css':
            minified = extract_critical_css(content)
        else:
            print(f"Unknown type: {file_type}")
            sys.exit(1)

        # Prepend an authorship banner to production assets (skip critical CSS).
        if file_type in ('css', 'js'):
            minified = f"{AUTHOR_BANNER}\n{minified}"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        original_size = len(content)
        minified_size = len(minified)
        reduction = ((original_size - minified_size) / original_size) * 100
        
        print(f"✓ Minified {input_file} -> {output_file}")
        print(f"  Original: {original_size:,} bytes")
        print(f"  Minified: {minified_size:,} bytes")
        print(f"  Reduction: {reduction:.1f}%")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
