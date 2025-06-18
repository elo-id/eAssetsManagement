
(function() {
  const elo = window.elo = window.elo || {};

  window.api = window.api || {};

  const loadAndExecute = function(src) {
    // get some kind of XMLHttpRequest
    const xhrObj = new XMLHttpRequest();

    // open and send a synchronous request
    xhrObj.open('GET', src, false);
    xhrObj.send('');
    // eslint-disable-next-line no-magic-numbers
    if (xhrObj.status === 200) {
      // add the returned content to a newly created script tag
      let code = xhrObj.responseText;

      // replace local variable with global one so data is not written to function scope
      code = code.replace('var elo = elo', 'var elo = window.elo');
      // create function to execute loaded script code
      const fct = new Function(code);

      fct();
    } else {
      // eslint-disable-next-line no-console
      console.error('Error loading devData scripts!', xhrObj.responseText);
    }
  };

  loadAndExecute('/ix-Contelo/plugin/de.elo.ix.plugin.proxy/wf/apps/pages/serverData.jsp');
  loadAndExecute('/ix-Contelo/plugin/de.elo.ix.plugin.proxy/wf/apps/pages/appConfig.jsp?id=exampleId&namespace=asset.management');
  elo.data = elo.data || {};
  elo.data.server = elo.data.server || {};
  elo.data.server.relativeAppUrl = '/ix-Contelo/plugin/de.elo.ix.plugin.proxy/wf';
  elo.data.server.isDevEnv = true;

  const favIcon = document.createElement('link');

  favIcon.rel = 'icon';
  favIcon.type = 'text/css';
  // eslint-disable-next-line prefer-template
  favIcon.href = elo.data.server.relativeAppUrl +
    '/apps/resources/images/elo-favicon.ico';
  favIcon.media = 'all';
  document.getElementsByTagName('head')[0].appendChild(favIcon);

  const fontCss = document.createElement('link');

  fontCss.rel = 'stylesheet';
  fontCss.type = 'text/css';
  // eslint-disable-next-line prefer-template
  fontCss.href = elo.data.server.relativeAppUrl +
    '/apps/mapping/modules/elo.module.font.01/resources/css/elo-sans-pro.css';
  fontCss.media = 'all';
  document.getElementsByTagName('head')[0].appendChild(fontCss);

api.init = function() {
    var connFact = new de.elo.ix.client.IXConnFactory(elo.data.server.ixUrl, elo.data.server.appId, elo.data.server.appVersion);
    connFact.sessOpts = connFact.sessOpts || {};
    connFact.sessOpts["ix.translateTerms"] = "true";
    connFact.sessOpts["ix.startDocMaskWorkflows"] = "true";
    connFact.sessOpts[connFact.CLIENT_APP_TYPE] = elo.data.server.ct;
    connFact.connProps = connFact.connProps || {};
    connFact.connProps[connFact.NB_OF_REVERSE_CNNS] = 0;
    var ci = connFact.makeDefaultClientInfo();
    ci.ticket = connFact.TICKET_FROM_COOKIE;
    connFact.create2(ci, 'administrator', 'eloajadeh', '', null, null, new de.elo.ix.client.AsyncCallback(function (con) {
        console.info("[elo-cli] devLogin success", con);
        elo.ixUrl = elo.data.server.ixUrl;
        elo.IX = con;
        api.webapps.WebApp.init();
    }, function (e) {
        console.error("[elo-cli] devLogin error", e);
    }));
}
                                }());
