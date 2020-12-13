import * as React from 'react'

export function Mailchimp({mailchimp}:{mailchimp: string}) {
  return (<>
    <div id="mc_embed_signup">
      <form action={mailchimp} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="form-inline">
        <div className="input-group">
          <input type="email" placeholder="Your Email Address" name="EMAIL" className="required form-control" id="mce-EMAIL"></input>
        </div>
        <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="btn btn-primary "></input>
        <div id="mce-responses" className="clear">
          <div className="response" id="mce-error-response" style={ {display: "none"} }></div>
          <div className="response" id="mce-success-response" style={ {display: "none"} }></div>
        </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
        <div style={ {position: "absolute", left: "-5000px"} } aria-hidden="true">
          <input type="text" name="b_fbcbfba66020e12dd41b9cf1b_4a0067c925" tabIndex={-1} value=""></input>
        </div>
      </form>
    </div>
    </>)
}