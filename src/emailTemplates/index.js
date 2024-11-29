const DeleteUserDataEmailTemplate = (userName) => {
  return `<div style="width:100%;margin:0;padding:0;line-height:1.6">

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="85%"
    style="margin:0 auto;font-family:Arial,Helvetica,sans-serif">
    <tbody>
        <td align="center" width="100%" style="padding-top:10px;margin:0 auto">

          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody>

              <tr>
                <td align="center" style=" padding-top: 22px;padding-bottom:10px;
              ">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;text-align:left;font-size:16px;color:#666666;border-collapse:collapse;">
                     
                     <tr>
                    <tbody>
              </tr>
              <tr>
                <td align="center"
                  style="  padding-bottom: 10px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; ">
                  <h1> User from Regaapp request</h1>
                  <h3
                    style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px; color:#002054f2">
                    ${userName} is requesting  to delete information </h3>
                </td>
              </tr>
            <td align="left"
                style="font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="    margin-bottom: 10px;">
               
                </p>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
  </tbody>
  </table>
</div>`;
};

const DeleteDataUserTemplate = () => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:Montserrat, helvetica, arial, sans-serif">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Deletion of userdata</title><!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]--><!--[if !mso]><!-- -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"><!--<![endif]-->
  <style type="text/css">
  #outlook a {
  padding:0;
  }
  .es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  }
  .es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
  }
  [data-ogsb] .es-button {
  border-width:0!important;
  padding:10px 20px 10px 20px!important;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:12px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
  </style>
  </head>
  <body style="width:100%;font-family:Montserrat, helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#EDE6F5"><!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile" color="#EDE6F5"></v:fill>
  </v:background>
  <![endif]-->
  <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#EDE6F5">
  <tr>
  <td valign="top" style="padding:0;Margin:0">
  <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;border-radius:20px;box-shadow:#7F7F7F 0px 0px 10px;width:600px" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
  <tr>
  <td align="left" bgcolor="#ffffff" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:25px;padding-bottom:25px;background-color:#ffffff;border-radius:20px 20px 0px 0px;background-image:url(https://vfxjzt.stripocdn.email/content/guids/CABINET_829b20c8e6b7fc68418b19f654df341a/images/group_6Df.png);background-repeat:no-repeat;background-position:right bottom" background="https://vfxjzt.stripocdn.email/content/guids/CABINET_829b20c8e6b7fc68418b19f654df341a/images/group_6Df.png"><!--[if mso]><table style="width:560px" cellpadding="0"
  cellspacing="0"><tr><td style="width:214px" valign="top"><![endif]-->
  <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
  <tr>
  <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:214px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://www.rega-app.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#251A51;font-size:14px"><img src="https://vfxjzt.stripocdn.email/content/guids/CABINET_e85d3f7ef0499aba4c259335a3856dc9/images/logo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="27"></a></td>
  </tr>
  </table></td>
  </tr>
  </table><!--[if mso]></td><td style="width:20px"></td><td style="width:326px" valign="top"><![endif]-->
  <table cellpadding="0" cellspacing="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:326px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0">
  <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr class="links">
  <td align="left" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:10px;border:0"><a target="_blank" href="https://www.facebook.com/regamindfulness" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#251A51;font-size:14px;direction:rtl">פייסבוק</a></td>
  <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:10px;border:0"><a target="_blank" href="https://www.instagram.com/rega.app" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#251A51;font-size:14px;direction:rtl">אינסטגרם</a></td>
  <td align="right" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:10px;border:0"><a target="_blank" href="https://www.rega-app.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#251A51;font-size:14px;direction:rtl">לאתר שלנו</a></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table><!--[if mso]></td></tr></table><![endif]--></td>
  </tr>
  <tr>
  <td align="left" bgcolor="#ffffff" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;background-color:#ffffff">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:560px">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#251A51;direction:rtl">רק&nbsp;<u>רגע</u></h1></td>
  </tr>
  <tr>
  <td align="center" class="es-m-p0r es-m-p0l es-m-txt-c" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px"><h4 style="Margin:0;line-height:17px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;direction:rtl;font-size:14px">בקשתך למחיקת נתונים נשלחה לאחד ממנהלי האפליקציה&nbsp;שלנו.</h4><h4 style="Margin:0;line-height:17px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;direction:rtl;font-size:14px">הנתונים שיימחקו כוללים:&nbsp;נתונים אודות השימוש שלך, מידע אישי, פרטי התחברות ועוד.</h4><h4 style="Margin:0;line-height:17px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;direction:rtl;font-size:14px">תוך 24 שעות מרגע קבלת הודעה זו, נתונים אלו ימחקו.</h4></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-bottom:30px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#f6f3e8;border-width:0px;display:inline-block;border-radius:30px;width:auto"><a href="mailto:hello@rega-app.com?subject=%D7%91%D7%99%D7%98%D7%95%D7%9C%20%D7%91%D7%A7%D7%A9%D7%AA%20%D7%9E%D7%97%D7%99%D7%A7%D7%AA%20%D7%94%D7%A0%D7%AA%D7%95%D7%A0%D7%99%D7%9D" class="es-button es-button-1640348097220" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#3f3534;font-size:18px;border-style:solid;border-color:#f6f3e8;border-width:10px 25px 10px 30px;display:inline-block;background:#f6f3e8;border-radius:30px;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center" dir="rtl">לביטול מחיקת הנתונים <!--[if !mso]><!-- --><img src="https://vfxjzt.stripocdn.email/content/guids/CABINET_e85d3f7ef0499aba4c259335a3856dc9/images/006meditation2x.png" alt="icon" width="26" align="absmiddle" style="display:inline-block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;margin-right:10px"><!--<![endif]--></a></span></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-bottom:20px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:600px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://www.rega-app.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#251A51;font-size:14px"><img class="adapt-img" src="https://vfxjzt.stripocdn.email/content/guids/CABINET_e85d3f7ef0499aba4c259335a3856dc9/images/intro2.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="485"></a></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" background="https://vfxjzt.stripocdn.email/content/guids/CABINET_829b20c8e6b7fc68418b19f654df341a/images/mask_group_s55.png" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;background-image:url(https://vfxjzt.stripocdn.email/content/guids/CABINET_829b20c8e6b7fc68418b19f654df341a/images/mask_group_s55.png);background-repeat:no-repeat;background-position:right center">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;display:none"></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
  <tr>
  <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, helvetica, arial, sans-serif;line-height:18px;color:#251a51;font-size:12px;direction:rtl"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#251A51;font-size:12px;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif" href="https://bit.ly/3BPzjry">מופעל על ידי חברת פיד-יו טכנולוגיות בע"מ</a></p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  </div>
  </body>
  </html>
  `;
};

const cancelSubscriptionTemplate = (userName, userId, email, reason) => {
  return `
  <div style="width: 100%; padding: 10px; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #666666">
    <div style="max-width: 600px; margin: auto; border-radius: 5px; background-color: #fafafa; padding: 20px; border: 1px solid #ddd;">
      
      <h1 style="color: #002054f2; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Subscription Cancellation Request</h1>

      <h2 style="color: #333; margin-top: 20px;">User Details:</h2>
      <p><strong>User Name: </strong> ${userName}</p>
      <p><strong>User ID: </strong> ${userId}</p>
      <p><strong>Email: </strong> ${email}</p>

      <h2 style="color: #333; margin-top: 20px;">Cancellation Reason:</h2>
      <p>${reason}</p>

      <p style="text-align: right; margin-top: 20px;"><small><em>This message was generated by Regaapp.</em></small></p>

    </div>
  </div>`;
};

module.exports = {
  DeleteUserDataEmailTemplate,
  DeleteDataUserTemplate,
  cancelSubscriptionTemplate,
};
