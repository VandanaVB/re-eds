#!/usr/bin/env python3
"""
Generate AEM Content Package v2 - Corrected JCR structure for franklin.delivery.
Each block and item node includes all template properties from component-definition.json.
"""

import os
import re
import zipfile
import json
from html.parser import HTMLParser
from datetime import datetime
import html as html_module

PACKAGE_NAME = "re-eds-content"
PACKAGE_VERSION = "2.0.0"
PACKAGE_GROUP = "re-eds"
CONTENT_ROOT = "/content/re-eds"
PAGE_TITLE = "Royal Enfield India | Roadster, Cruiser &amp; Adventure Bikes"
PAGE_DESCRIPTION = "Official site of Royal Enfield bikes in India."

# Load component definitions
with open("component-definition.json") as f:
    COMP_DEFS = json.load(f)

# Build lookup maps from component definitions
BLOCK_TEMPLATES = {}
ITEM_TEMPLATES = {}
for group in COMP_DEFS["groups"]:
    for comp in group["components"]:
        tpl = comp.get("plugins", {}).get("xwalk", {}).get("page", {}).get("template", {})
        rt = comp.get("plugins", {}).get("xwalk", {}).get("page", {}).get("resourceType", "")
        if "block/v1/block/item" in rt:
            # This is an item component
            ITEM_TEMPLATES[comp["id"]] = {
                "resourceType": rt,
                "template": tpl,
            }
        elif "block/v1/block" in rt:
            # This is a block component
            block_name = tpl.get("name", "")
            block_class = block_name.lower().replace(" ", "-") if block_name else comp["id"]
            BLOCK_TEMPLATES[block_class] = {
                "resourceType": rt,
                "template": tpl,
                "id": comp["id"],
            }
        elif "columns/v1/columns" in rt:
            block_name = comp["title"]
            block_class = comp["id"]
            BLOCK_TEMPLATES[block_class] = {
                "resourceType": rt,
                "template": tpl,
                "id": comp["id"],
            }

# Map block classes to their item component IDs
BLOCK_ITEM_MAP = {
    "carousel-hero": "carousel-hero-item",
    "carousel-legacy": "carousel-legacy-item",
    "cards-spotlight": "card",
    "cards-culture": "card",
    "cards-events": "card",
    "cards-shop": "card",
    "tabs-showcase": "tabs-showcase-item",
}


def xml_attr(s):
    """Escape string for XML attribute."""
    if s is None:
        return ""
    s = str(s)
    s = s.replace("&", "&amp;")
    s = s.replace("<", "&lt;")
    s = s.replace(">", "&gt;")
    s = s.replace('"', "&quot;")
    return s


class FieldParser(HTMLParser):
    """Parse block item HTML to extract field values from <!-- field:name --> hints."""

    def __init__(self):
        super().__init__()
        self.fields = {}
        self.current_field = None
        self.current_content = []

    def handle_comment(self, data):
        m = re.match(r"\s*field:(\w+)\s*", data)
        if m:
            if self.current_field and self.current_content:
                self.fields[self.current_field] = "".join(self.current_content).strip()
            self.current_field = m.group(1)
            self.current_content = []

    def handle_starttag(self, tag, attrs):
        if self.current_field:
            attr_str = "".join(f' {k}="{html_module.escape(v or "")}"' for k, v in attrs)
            self.current_content.append(f"<{tag}{attr_str}>")

    def handle_endtag(self, tag):
        if self.current_field:
            self.current_content.append(f"</{tag}>")

    def handle_data(self, data):
        if self.current_field:
            self.current_content.append(data)

    def get_fields(self):
        if self.current_field and self.current_content:
            self.fields[self.current_field] = "".join(self.current_content).strip()
        return self.fields


def parse_fields(item_html):
    """Parse field values from a block item HTML."""
    p = FieldParser()
    p.feed(item_html)
    return p.get_fields()


def extract_img_props(html_str):
    """Extract image src and alt from HTML containing <img>."""
    src = re.search(r'src="([^"]*)"', html_str)
    alt = re.search(r'alt="([^"]*)"', html_str)
    return (src.group(1) if src else "", alt.group(1) if alt else "")


def split_sections(html_content):
    """Split content into top-level <div> sections."""
    sections = []
    depth = 0
    buf = []
    i = 0
    while i < len(html_content):
        if html_content[i : i + 5] == "<div>" and depth == 0:
            depth = 1
            buf = ["<div>"]
            i += 5
        elif html_content[i : i + 4] == "<div":
            if depth > 0:
                depth += 1
            buf.append(html_content[i])
            i += 1
        elif html_content[i : i + 6] == "</div>":
            if depth > 0:
                depth -= 1
                buf.append("</div>")
                if depth == 0:
                    sections.append("".join(buf))
                    buf = []
                i += 6
            else:
                i += 1
        else:
            if depth > 0:
                buf.append(html_content[i])
            i += 1
    return sections


def parse_section_meta(section_html):
    """Extract section-metadata key-value pairs."""
    meta = {}
    m = re.search(r'<div class="section-metadata">(.*?)</div>\s*</div>', section_html, re.DOTALL)
    if m:
        for km, vm in re.findall(r"<div><div>(.*?)</div><div>(.*?)</div></div>", m.group(1), re.DOTALL):
            meta[km.strip()] = vm.strip()
    return meta


def parse_blocks(section_html):
    """Extract blocks and their items from section HTML."""
    known = set(BLOCK_TEMPLATES.keys())
    blocks = []
    seen = {}
    for m in re.finditer(r'<div class="([^"]+)">((?:<div>.*?</div>)+)</div>', section_html, re.DOTALL):
        cls = m.group(1)
        if cls not in known:
            continue
        if cls not in seen:
            seen[cls] = {"class": cls, "items": []}
            blocks.append(seen[cls])
        row_html = m.group(2)
        fields = parse_fields(row_html)
        seen[cls]["items"].append(fields)
    return blocks


def item_xml(fields, idx, block_class, indent):
    """Generate XML for a block item node."""
    item_id = BLOCK_ITEM_MAP.get(block_class, "card")
    item_tpl = ITEM_TEMPLATES.get(item_id, {})
    rt = item_tpl.get("resourceType", "core/franklin/components/block/v1/block/item")
    tpl = item_tpl.get("template", {})

    lines = [f'{indent}<item_{idx}']
    lines.append(f'{indent}    jcr:primaryType="nt:unstructured"')
    lines.append(f'{indent}    sling:resourceType="{rt}"')

    # Add template properties (name, model, etc.)
    for k, v in tpl.items():
        lines.append(f'{indent}    {k}="{xml_attr(v)}"')

    # Add field properties
    for fname, fval in fields.items():
        if "<img" in fval:
            src, alt = extract_img_props(fval)
            lines.append(f'{indent}    {fname}="{xml_attr(src)}"')
            lines.append(f'{indent}    {fname}Alt="{xml_attr(alt)}"')
        else:
            lines.append(f'{indent}    {fname}="{xml_attr(fval)}"')

    lines.append(f"{indent}/>")
    return "\n".join(lines)


def block_xml(block, idx, indent):
    """Generate XML for a block node."""
    cls = block["class"]
    info = BLOCK_TEMPLATES.get(cls, {})
    rt = info.get("resourceType", "core/franklin/components/block/v1/block")
    tpl = info.get("template", {})

    items = []
    for i, fields in enumerate(block["items"]):
        items.append(item_xml(fields, i, cls, indent + "    "))

    lines = [f'{indent}<block_{idx}']
    lines.append(f'{indent}    jcr:primaryType="nt:unstructured"')
    lines.append(f'{indent}    sling:resourceType="{rt}"')

    # Add all template properties from component-definition.json
    for k, v in tpl.items():
        lines.append(f'{indent}    {k}="{xml_attr(v)}"')

    if items:
        lines.append(f"{indent}>")
        lines.extend(items)
        lines.append(f"{indent}</block_{idx}>")
    else:
        lines.append(f"{indent}/>")

    return "\n".join(lines)


def section_xml(section_html, idx):
    """Generate XML for a section node."""
    meta = parse_section_meta(section_html)
    blocks = parse_blocks(section_html)
    indent = "    "

    lines = [f'{indent}<section_{idx}']
    lines.append(f'{indent}    jcr:primaryType="nt:unstructured"')
    lines.append(f'{indent}    sling:resourceType="{SECTION_RT}"')
    if meta.get("style"):
        lines.append(f'{indent}    style="{xml_attr(meta["style"])}"')

    if blocks:
        lines.append(f"{indent}>")
        for i, b in enumerate(blocks):
            lines.append(block_xml(b, i, indent + "    "))
        lines.append(f"{indent}</section_{idx}>")
    else:
        lines.append(f"{indent}/>")

    return "\n".join(lines)


SECTION_RT = "core/franklin/components/section/v1/section"
PAGE_RT = "core/franklin/components/page/v1/page"


def page_content_xml(sections_html):
    """Generate .content.xml for the page including jcr:content and all children."""
    # This file goes in the page FOLDER's .content.xml and defines BOTH
    # the cq:Page AND jcr:content in one file (full aggregation)
    secs = []
    for i, sh in enumerate(sections_html):
        secs.append(section_xml(sh, i))

    sections_str = "\n".join(secs) if secs else ""

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        jcr:title="{PAGE_TITLE}"
        jcr:description="{xml_attr(PAGE_DESCRIPTION)}"
        sling:resourceType="{PAGE_RT}"
        cq:template="/conf/re-eds/settings/wcm/templates/page">
{sections_str}
    </jcr:content>
</jcr:root>
"""


def folder_xml(title=""):
    t = f'\n    jcr:title="{xml_attr(title)}"' if title else ""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:OrderedFolder"{t}/>
"""


def nav_page_xml():
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        jcr:title="Navigation"
        sling:resourceType="{PAGE_RT}"
        cq:template="/conf/re-eds/settings/wcm/templates/page"/>
</jcr:root>
"""


def filter_xml():
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
    <filter root="{CONTENT_ROOT}/in/en/home" mode="merge"/>
    <filter root="{CONTENT_ROOT}/nav" mode="merge"/>
</workspaceFilter>
"""


def properties_xml():
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <entry key="name">{PACKAGE_NAME}</entry>
    <entry key="version">{PACKAGE_VERSION}</entry>
    <entry key="group">{PACKAGE_GROUP}</entry>
    <entry key="description">Royal Enfield Homepage - Migrated content for Universal Editor (v2)</entry>
    <entry key="created">{now}</entry>
    <entry key="createdBy">migration-tool</entry>
    <entry key="packageType">content</entry>
    <entry key="requiresRoot">false</entry>
    <entry key="acHandling">merge</entry>
</properties>
"""


def main():
    with open("content/in/en/home.plain.html") as f:
        home_html = f.read()

    sections = split_sections(home_html)
    print(f"Parsed {len(sections)} sections")

    # Show block templates found
    print(f"\nBlock templates loaded:")
    for cls, info in BLOCK_TEMPLATES.items():
        print(f"  {cls}: name={info['template'].get('name','-')}")

    print(f"\nItem templates loaded:")
    for iid, info in ITEM_TEMPLATES.items():
        print(f"  {iid}: name={info['template'].get('name','-')}, model={info['template'].get('model','-')}")

    content_xml = page_content_xml(sections)

    # Show summary of sections and blocks
    for i, sh in enumerate(sections):
        blocks = parse_blocks(sh)
        if blocks:
            desc = ', '.join(b['class'] + '(' + str(len(b['items'])) + ' items)' for b in blocks)
            print(f"\n  Section {i}: {desc}")

    jcr = f"jcr_root{CONTENT_ROOT}"
    pkg = f"tools/{PACKAGE_NAME}-{PACKAGE_VERSION}.zip"

    with zipfile.ZipFile(pkg, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("META-INF/vault/filter.xml", filter_xml())
        zf.writestr("META-INF/vault/properties.xml", properties_xml())
        zf.writestr(f"{jcr}/.content.xml", folder_xml("re-eds"))
        zf.writestr(f"{jcr}/in/.content.xml", folder_xml("in"))
        zf.writestr(f"{jcr}/in/en/.content.xml", folder_xml("en"))
        # Full page XML (cq:Page + jcr:content + sections + blocks in one file)
        zf.writestr(f"{jcr}/in/en/home/.content.xml", content_xml)
        # Nav page
        zf.writestr(f"{jcr}/nav/.content.xml", nav_page_xml())

    print(f"\nPackage: {pkg} ({os.path.getsize(pkg):,} bytes)")

    with zipfile.ZipFile(pkg) as zf:
        print(f"\nContents:")
        for n in sorted(zf.namelist()):
            print(f"  {n} ({zf.getinfo(n).file_size:,} bytes)")

    # Show first part of content XML for verification
    print(f"\n--- Content XML preview (first 50 lines) ---")
    for i, line in enumerate(content_xml.split("\n")[:50]):
        print(f"  {line}")


main()
