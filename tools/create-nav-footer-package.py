#!/usr/bin/env python3
"""Create AEM content package for nav and footer fragment pages."""

import os, zipfile
from datetime import datetime

CONTENT_ROOT = "/content/re-eds"

def xa(s):
    return str(s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;")

def nav_page_xml():
    """Nav page with 3 sections: brand, sections (dropdowns), tools."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        jcr:title="Navigation"
        sling:resourceType="core/franklin/components/page/v1/page"
        cq:template="/conf/re-eds/settings/wcm/templates/page">
        <root
            jcr:primaryType="nt:unstructured"
            sling:resourceType="core/franklin/components/section/v1/section">
            <section
                jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/section/v1/section">
                <item_brand
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="core/franklin/components/text/v1/text"
                    text="&lt;p&gt;&lt;a href=&quot;/&quot;&gt;&lt;img src=&quot;https://www.royalenfield.com/content/dam/RE-Platform-Revamp/re-revamp-commons/logo.webp&quot; alt=&quot;Royal Enfield&quot;&gt;&lt;/a&gt;&lt;/p&gt;"/>
                <item_sections
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="core/franklin/components/text/v1/text"
                    text="{xa(NAV_SECTIONS_HTML)}"/>
                <item_tools
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="core/franklin/components/text/v1/text"
                    text="{xa(NAV_TOOLS_HTML)}"/>
            </section>
        </root>
    </jcr:content>
</jcr:root>
"""

def footer_page_xml():
    """Footer page with links and copyright."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        jcr:title="Footer"
        sling:resourceType="core/franklin/components/page/v1/page"
        cq:template="/conf/re-eds/settings/wcm/templates/page">
        <root
            jcr:primaryType="nt:unstructured"
            sling:resourceType="core/franklin/components/section/v1/section">
            <section
                jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/section/v1/section">
                <item_0
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="core/franklin/components/text/v1/text"
                    text="{xa(FOOTER_HTML)}"/>
            </section>
        </root>
    </jcr:content>
</jcr:root>
"""

# Nav sections HTML (the dropdown menus)
NAV_SECTIONS_HTML = """<ul>
<li><p><strong>Motorcycles</strong></p>
<ul>
<li><a href="/in/en/motorcycles/new-himalayan/">Himalayan 450</a></li>
<li><a href="/in/en/motorcycles/guerrilla-450/">Guerrilla 450</a></li>
<li><a href="/in/en/motorcycles/classic-350/">Classic 350</a></li>
<li><a href="/in/en/motorcycles/classic-650/">Classic 650</a></li>
<li><a href="/in/en/motorcycles/bullet-650/">Bullet 650</a></li>
<li><a href="/in/en/motorcycles/hunter-350/">Hunter 350</a></li>
<li><a href="/in/en/motorcycles/meteor/">Meteor 350</a></li>
<li><a href="/in/en/motorcycles/shotgun-650/">Shotgun 650</a></li>
<li><a href="/in/en/motorcycles/continental-gt/">Continental GT 650</a></li>
<li><a href="/in/en/motorcycles/interceptor/">Interceptor 650</a></li>
<li><a href="/in/en/motorcycles/super-meteor-650/">Super Meteor 650</a></li>
<li><a href="/in/en/motorcycles/scram-440/">Scram 440</a></li>
<li><a href="/in/en/motorcycles/bear-650/">Bear 650</a></li>
<li><a href="/in/en/motorcycles/goan-classic-350/">Goan Classic 350</a></li>
<li><a href="/in/en/motorcycles/bullet-350/">Bullet 350</a></li>
</ul></li>
<li><p><strong>Shop</strong></p>
<ul>
<li><a href="https://makeityours.royalenfield.com/">Personalise Your Ride</a></li>
<li><a href="/in/en/gma/">Explore Accessories</a></li>
<li><a href="https://store.royalenfield.com/en/riding-gear">Riding Gear</a></li>
<li><a href="https://store.royalenfield.com/en/lifestyle-apparel">Apparel</a></li>
<li><a href="/in/en/rentals/">Rentals</a></li>
<li><a href="/in/en/tours/">Tours</a></li>
<li><a href="/in/en/reown/">REOwn</a></li>
</ul></li>
<li><p><strong>Service</strong></p>
<ul>
<li><a href="/in/en/service/">Book a Service</a></li>
<li><a href="/in/en/service/#scc">Service Cost Calculator</a></li>
<li><a href="/in/en/locate-us/">Service Centres</a></li>
<li><a href="/in/en/service/ride-sure">Service Packages</a></li>
</ul></li>
<li><p><strong>Ride</strong></p>
<ul>
<li><a href="/in/en/rides-calendar/">Rides &amp; Events</a></li>
<li><a href="/in/en/tours/">Tours</a></li>
<li><a href="/in/en/rides/events/motoverse/">Motoverse</a></li>
<li><a href="/in/en/rentals/">Rentals</a></li>
</ul></li>
<li><p><strong>MotoCulture</strong></p>
<ul>
<li><a href="https://tv.royalenfield.com/">Royal Enfield TV</a></li>
<li><a href="/in/en/custom-world/">Custom World</a></li>
<li><a href="/in/en/art-of-motorcycling/">Art of Motorcycling</a></li>
<li><a href="/in/en/mlg/">MLG Comics</a></li>
</ul></li>
<li><p><strong>Explore</strong></p>
<ul>
<li><a href="/in/en/our-world/media/news/">News &amp; Media</a></li>
<li><a href="/in/en/our-world/since-1901/">Legacy Since 1901</a></li>
<li><a href="/in/en/made-in-madras/">Made In Madras</a></li>
<li><a href="https://socialmission.royalenfield.com/">Social Mission</a></li>
</ul></li>
</ul>"""

# Nav tools HTML
NAV_TOOLS_HTML = """<ul>
<li><a href="/in/en/locate-us/">Locate Us</a></li>
<li><a href="/in/en/forms/book-a-test-ride/">Book a Test Ride</a></li>
</ul>"""

# Footer HTML
FOOTER_HTML = """<p><img src="https://www.royalenfield.com/content/dam/RE-Platform-Revamp/re-revamp-commons/logo.webp" alt="Royal Enfield"></p>
<h3>Motorcycles</h3>
<ul>
<li><a href="/in/en/motorcycles/">All Motorcycles</a></li>
<li><a href="/in/en/motorcycles/classic-350/">Classic 350</a></li>
<li><a href="/in/en/motorcycles/hunter-350/">Hunter 350</a></li>
<li><a href="/in/en/motorcycles/meteor/">Meteor 350</a></li>
</ul>
<h3>Support</h3>
<ul>
<li><a href="/in/en/locate-us/">Locate Us</a></li>
<li><a href="/in/en/service/">Service</a></li>
<li><a href="/in/en/contact-us/">Contact Us</a></li>
</ul>
<h3>About Us</h3>
<ul>
<li><a href="/in/en/our-world/since-1901/">Our Story</a></li>
<li><a href="https://socialmission.royalenfield.com/">Social Mission</a></li>
</ul>
<p>© 2024 Royal Enfield. All rights reserved.</p>
<ul>
<li><a href="/in/en/privacy-policy/">Privacy Policy</a></li>
<li><a href="/in/en/terms/">Terms of Use</a></li>
</ul>"""


def main():
    jcr = f"jcr_root{CONTENT_ROOT}"
    pkg = "tools/re-eds-nav-footer-1.0.0.zip"

    with zipfile.ZipFile(pkg, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("META-INF/vault/filter.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
    <filter root="{CONTENT_ROOT}/nav" mode="replace"/>
    <filter root="{CONTENT_ROOT}/footer" mode="replace"/>
</workspaceFilter>
""")
        zf.writestr("META-INF/vault/properties.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <entry key="name">re-eds-nav-footer</entry>
    <entry key="version">1.0.0</entry>
    <entry key="group">re-eds</entry>
    <entry key="description">Navigation and Footer content for Royal Enfield</entry>
    <entry key="created">{datetime.now().isoformat()}</entry>
    <entry key="createdBy">migration-tool</entry>
    <entry key="packageType">content</entry>
</properties>
""")
        zf.writestr(f"{jcr}/nav/.content.xml", nav_page_xml())
        zf.writestr(f"{jcr}/footer/.content.xml", footer_page_xml())

    print(f"Package: {pkg} ({os.path.getsize(pkg):,} bytes)")
    with zipfile.ZipFile(pkg) as zf:
        for n in sorted(zf.namelist()):
            print(f"  {n} ({zf.getinfo(n).file_size:,} bytes)")

main()
