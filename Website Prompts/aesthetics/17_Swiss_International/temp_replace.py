import re
import sys

file_path = r'c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts\aesthetics\17_Swiss_International\17_Swiss_International_Mindmap.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

style_content = """<style>
/* Swiss International Typographic Style */
:root {
    --bg-color: #FFFFFF;
    --text-color: #000000;
    --border-color: #000000;
    --accent-red: #FF0000;
    --secondary-text: #555555;
    
    --panel-width: 0px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    background-image: repeating-linear-gradient(180deg, transparent, transparent 23px, rgba(0,0,0,0.06) 23px, rgba(0,0,0,0.06) 24px);
    background-size: 100% 24px;
}

/* Page Layout */
.header {
    background: #FFFFFF;
    padding: 28px 48px 20px;
    max-width: 1400px;
    margin: 0 auto;
    border-bottom: 6px solid #FF0000;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-title h1 {
    color: #000000;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.03em;
    text-transform: none;
    margin-bottom: 6px;
}

.header-title p {
    color: #FF0000;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 400;
}

.header-controls {
    display: flex;
    gap: 16px;
}

.btn-minimal {
    background: #FF0000;
    border: none;
    border-radius: 0;
    color: #FFFFFF;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 150ms linear;
}

.btn-minimal:hover {
    background: #000000;
}

.btn-minimal-ghost {
    background: #FFFFFF;
    border: 2px solid #000000;
    color: #000000;
    border-radius: 0;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 150ms linear;
}

.btn-minimal-ghost:hover {
    background: #FF0000;
    color: #FFFFFF;
    border-color: #FF0000;
}

.main {
    padding: 40px 48px;
    max-width: 1400px;
    margin: 0 auto;
    overflow: visible;
}

.mindmap-container {
    position: relative;
    background: #FFFFFF;
    border: none;
    border-top: 6px solid #FF0000;
    border-radius: 0;
    padding: 64px;
    margin-bottom: 40px;
    overflow: visible;
    width: max-content;
    min-width: 100%;
    min-height: 600px;
    box-shadow: none;
}

#mindmap-svg-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
}

.tree ul {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0;
    margin: 0;
    list-style: none;
    position: relative;
    z-index: 2;
}

.tree li {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 80px;
    position: relative;
}

.node-content {
    background: #FFFFFF;
    border: none;
    border-top: 3px solid #000000;
    border-radius: 0;
    color: #000000;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.01em;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 150ms linear;
    user-select: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.node-content:hover {
    border-top-color: #FF0000;
    color: #FF0000;
}

.node.root > .node-content {
    background: #FF0000;
    border: none;
    border-radius: 0;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 10px 24px;
    box-shadow: none;
}

.node.root > .node-content:hover {
    background: #000000;
}

.node.category-color > .node-content {
    border-top: 3px solid #FF0000;
    color: #FF0000;
    background: #FFFFFF;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.node.category-type > .node-content {
    border-top: 3px solid #000000;
    color: #000000;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.node.category-spacing > .node-content {
    border-top: 3px solid #555555;
    color: #555555;
    font-weight: 500;
}

.node.category-borders > .node-content {
    border-top: 3px solid #000000;
    color: #000000;
}

.node.category-ui > .node-content {
    border-top: 3px solid #FF0000;
    color: #FF0000;
}

.node.category-imagery > .node-content {
    border-top: 3px solid #333333;
    color: #333333;
}

.node.category-anim > .node-content {
    border-top: 3px solid #FF0000;
    color: #990000;
}

.node.category-avoid > .node-content {
    border-top: 3px solid #FF0000;
    color: #FF0000;
    background: rgba(255,0,0,0.04);
}

.node.interactive-leaf > .node-content {
    background: #FF0000;
    border: none;
    border-radius: 0;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.node.interactive-leaf > .node-content:hover {
    background: #000000;
}

.tree li.collapsed > ul {
    display: none;
}

.tree-color-box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 0;
    border: 1px solid #000000;
    vertical-align: middle;
}

.panel-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: transparent;
    backdrop-filter: none;
    opacity: 0 !important;
    pointer-events: none !important;
    transition: none;
    z-index: 999;
}
.panel-overlay.active {
    opacity: 0 !important;
    pointer-events: none !important;
}

.interactive-panel {
    position: fixed;
    top: 0; right: 0;
    height: 100vh;
    width: 0;
    background: #FFFFFF;
    border-left: 6px solid #FF0000;
    box-shadow: none;
    z-index: 1000;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    transition: width 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
    background: #000000;
    border-bottom: 4px solid #FF0000;
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h2 {
    color: #FFFFFF;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.panel-header-buttons {
    display: flex;
    gap: 12px;
}

.panel-btn-icon {
    border: 2px solid rgba(255,255,255,0.5);
    color: rgba(255,255,255,0.8);
    background: transparent;
    border-radius: 0;
    font-family: 'Helvetica', Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 150ms linear;
}

.panel-btn-icon:hover {
    background: rgba(255,0,0,0.5);
    border-color: #FF0000;
    color: #FFFFFF;
}

.panel-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 32px;
}

.studio-content {
    display: none;
    flex-direction: column;
    gap: 24px;
    height: 100%;
}
.studio-content.active {
    display: flex;
}

.studio-desc {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #555555;
    line-height: 1.5;
    letter-spacing: 0;
}

/* Extras */
.color-card {
    background: #FFFFFF;
    border: 2px solid #000000;
    border-radius: 0;
    color: #000000;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
}
.color-card-swatch {
    width: 100%;
    height: 80px;
    border-radius: 0;
    border: 1px solid #000000;
}
.color-card-name {
    font-size: 11px;
    font-weight: 700;
    color: #000000;
    text-align: center;
    word-break: break-word;
    font-family: 'Helvetica', Arial, sans-serif;
}
.color-card-hex {
    font-family: monospace;
    font-size: 10px;
    color: #555555;
}
.color-card-remove {
    position: absolute;
    top: 4px; right: 4px;
    background: transparent;
    border: none;
    font-size: 12px;
    color: #000000;
    cursor: pointer;
}
.color-card-remove:hover {
    color: #FF0000;
}
.comparison-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 16px;
    margin-top: 16px;
}
.clear-btn {
    margin-top: 16px;
    padding: 12px;
    background: #FFFFFF;
    border: 2px solid #000000;
    color: #000000;
    border-radius: 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 150ms linear;
    width: 100%;
}
.clear-btn:hover {
    background: #FF0000;
    color: #FFFFFF;
    border-color: #FF0000;
}

.noise-bg {
    display: none;
    pointer-events: none;
}

/* Other UI styles matching aesthetic */
.typo-studio-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
    height: 100%;
    align-items: stretch;
}
.typo-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    padding: 24px;
    overflow-y: auto;
}
.device-btn {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 150ms linear;
    color: #000000;
}
.device-btn:hover {
    background: #FF0000;
    border-color: #FF0000;
    color: #FFFFFF;
}
.device-btn.active {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
}
.control-group label {
    font-size: 11px;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    justify-content: space-between;
}
.control-group select, .control-group input[type="text"] {
    padding: 8px 12px;
    border-radius: 0;
    border: 1px solid #000000;
    background: #FFFFFF;
    font-family: inherit;
    font-size: 12px;
    outline: none;
}
.control-group input[type="range"] {
    width: 100%;
    cursor: pointer;
    accent-color: #FF0000;
}
.typo-preview-panel {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: start;
}
.viewport-simulator {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    box-shadow: none;
    transition: width 150ms linear;
    width: 375px;
    max-width: 100%;
    padding: 28px;
}
.blog-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #555555;
    margin-bottom: 12px;
}
.blog-headline {
    color: #000000;
    margin-bottom: 24px;
}
.blog-meta {
    font-size: 12px;
    color: #555555;
    margin-bottom: 16px;
}
.blog-divider {
    border: none;
    border-top: 1px solid #000000;
    margin-bottom: 24px;
}
.blog-paragraph {
    color: #000000;
}
.anim-studio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 12px;
}
.anim-studio-box {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.anim-studio-box h4 {
    font-size: 13px;
    font-weight: 700;
    color: #000000;
}
.anim-spec {
    font-size: 11px;
    color: #555555;
}
.anim-stage {
    height: 110px;
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.anim-target {
    padding: 10px 20px;
    background: #FF0000;
    color: #FFFFFF;
    border-radius: 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
.anim-btn {
    padding: 6px 12px;
    background: #FFFFFF;
    border: 1px solid #000000;
    color: #000000;
    border-radius: 0;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    transition: all 150ms linear;
    text-transform: uppercase;
    width: max-content;
}
.anim-btn:hover {
    background: #000000;
    color: #FFFFFF;
}
.font-spec-card {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.font-spec-card h3 {
    font-size: 24px;
    font-weight: 700;
    border-bottom: 2px solid #000000;
    padding-bottom: 8px;
    color: #000000;
}
.font-spec-alphabet {
    font-size: 14px;
    color: #555555;
}
.font-spec-preview-sentence {
    color: #000000;
    padding: 12px 0;
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
}
.font-spec-weights button {
    background: #FFFFFF;
    border: 1px solid #000000;
    padding: 4px 10px;
    border-radius: 0;
    font-size: 10px;
    cursor: pointer;
    transition: all 150ms linear;
    color: #000000;
}
.font-spec-weights button:hover, .font-spec-weights button.active {
    background: #000000;
    color: #FFFFFF;
}
.anim-meta {
    background: #FFFFFF;
    border: 1px solid #000000;
    border-radius: 0;
    color: #555555;
}
</style>"""

new_content = re.sub(r'<style>.*?</style>', style_content, content, flags=re.DOTALL)
new_content = re.sub(r'<style>.*?</style>', '', new_content, flags=re.DOTALL) # remove any extra style tags if there were multiple blocks

# We actually only want to replace all <style> blocks with the single new one.
# So:
parts = re.split(r'<style>.*?</style>', content, flags=re.DOTALL)
final_content = parts[0] + style_content + "".join(parts[1:])

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)
