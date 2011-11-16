/*
 * Copyright 2009-2011 Prime Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.mobile.renderkit;

import java.io.IOException;
import java.util.Map;
import javax.faces.component.UIComponent;
import javax.faces.component.html.HtmlForm;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import org.primefaces.renderkit.CoreRenderer;

public class FormRenderer extends CoreRenderer {

    @Override
    public void decode(FacesContext context, UIComponent component) {
        HtmlForm form = (HtmlForm) component;
        String clientId = form.getClientId(context);
        Map<String, String> params = context.getExternalContext().getRequestParameterMap();
        
        if(params.containsKey(clientId))
            form.setSubmitted(true);
        else
            form.setSubmitted(false);
    }
    
    @Override
    public void encodeBegin(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        ExternalContext externalContext = context.getExternalContext();
        String clientId = component.getClientId(context);
        HtmlForm form = (HtmlForm) component;
        String actionURL = context.getApplication().getViewHandler().getActionURL(context, context.getViewRoot().getViewId());
        actionURL = externalContext.encodeActionURL(actionURL);

        writer.startElement("form", component);
        writer.writeAttribute("id", clientId, "clientId");
        writer.writeAttribute("name", clientId, "name");
        writer.writeAttribute("method", "post", null);
        writer.writeAttribute("action", actionURL, null);

        if(form.getStyleClass() != null) writer.writeAttribute("class", form.getStyleClass(), "styleClass");
        if(form.getStyle() != null) writer.writeAttribute("style", form.getStyle(), "style");
        if(form.getAcceptcharset() != null) writer.writeAttribute("accept-charset", form.getAcceptcharset(), "acceptcharset");

        //submit field
        encodeHiddenField(context, clientId, clientId);

        //partial hidden field
        String partialActionURL = externalContext.encodePartialActionURL(actionURL);
        if(partialActionURL != null && !partialActionURL.equals(actionURL)) {
            encodeHiddenField(context, "javax.faces.encodedURL", partialActionURL);
        }
    }
    
    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        
        //view state
        context.getApplication().getViewHandler().writeState(context);
        
        //mobile render kit
        encodeHiddenField(context, "javax.faces.RenderKitId", "PRIMEFACES_MOBILE");

        writer.endElement("form");
    }
    
    private void encodeHiddenField(FacesContext context, String name, String value) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        
        writer.startElement("input", null);
        writer.writeAttribute("type", "hidden", "type");
        writer.writeAttribute("name", name, null);
        writer.writeAttribute("id", name, null);
        writer.writeAttribute("value", value, "value");
        writer.endElement("input");
    }
}
