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

module.exports = {
  DeleteUserDataEmailTemplate,
};
