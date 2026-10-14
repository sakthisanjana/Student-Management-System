<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
    <html><head><title>Student Records</title></head><body>
      <h2>Student Management System</h2>
      <table border="1" cellpadding="10">
        <tr><th>Name</th><th>Register Number</th><th>Department</th></tr>
        <xsl:for-each select="students/student">
          <tr><td><xsl:value-of select="name"/></td><td><xsl:value-of select="regno"/></td><td><xsl:value-of select="department"/></td></tr>
        </xsl:for-each>
      </table>
    </body></html>
  </xsl:template>
</xsl:stylesheet>
