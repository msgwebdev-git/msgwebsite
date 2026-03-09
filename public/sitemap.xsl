<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Media Show Grup</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            background: #f8f9fa;
            padding: 24px;
          }
          .header {
            background: #0a0a0a;
            color: #fff;
            padding: 32px 24px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 14px;
            color: #a0a0a0;
          }
          .stats {
            display: flex;
            gap: 24px;
            margin-top: 16px;
          }
          .stat {
            background: rgba(255,255,255,0.1);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
          }
          .stat strong {
            display: block;
            font-size: 20px;
            margin-bottom: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          }
          th {
            background: #f1f3f5;
            text-align: left;
            padding: 12px 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #666;
            border-bottom: 1px solid #e9ecef;
          }
          td {
            padding: 10px 16px;
            font-size: 13px;
            border-bottom: 1px solid #f1f3f5;
            vertical-align: top;
          }
          tr:hover td { background: #f8f9fa; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .priority-high { background: #d4edda; color: #155724; }
          .priority-medium { background: #fff3cd; color: #856404; }
          .priority-low { background: #e2e3e5; color: #383d41; }
          .alternates {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            margin-top: 4px;
          }
          .alt-lang {
            display: inline-block;
            padding: 1px 6px;
            background: #e9ecef;
            border-radius: 3px;
            font-size: 11px;
            color: #495057;
            text-transform: uppercase;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            margin-top: 24px;
            font-size: 13px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>XML Sitemap</h1>
          <p>This sitemap contains all URLs for mediashowgrup.com, used by search engines like Google, Bing, and Yandex for indexing.</p>
          <div class="stats">
            <div class="stat">
              <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
              URLs
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Freq</th>
              <th>Last Modified</th>
              <th>Languages</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <span class="priority priority-high"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.6">
                      <span class="priority priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority priority-low"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
                <td>
                  <div class="alternates">
                    <xsl:for-each select="xhtml:link[@rel='alternate']">
                      <span class="alt-lang"><xsl:value-of select="@hreflang"/></span>
                    </xsl:for-each>
                  </div>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>

        <div class="footer">
          Generated by Media Show Grup — <a href="https://mediashowgrup.com">mediashowgrup.com</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
