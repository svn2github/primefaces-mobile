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
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import org.primefaces.component.panel.Panel;
import org.primefaces.renderkit.CoreRenderer;

public class PanelRenderer extends CoreRenderer {

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        Panel panel = (Panel) component;
        String header = panel.getHeader();

        writer.startElement("div", panel);
        writer.writeAttribute("id", panel.getClientId(context), null);
        writer.writeAttribute("data-role", "collapsible", null);

        if(!panel.isCollapsed()) writer.writeAttribute("data-collapsed", "false", null);
        if(panel.getStyle() != null) writer.writeAttribute("style", panel.getStyle(), null);
        if(panel.getStyleClass() != null) writer.writeAttribute("class", panel.getStyleClass(), null);

        //header
        writer.startElement("h3", panel);
        if(header != null) {
            writer.writeText(header, null);
        }
        writer.endElement("h3");

        //content
        writer.startElement("p", panel);
        renderChildren(context, panel);
        writer.endElement("p");

        writer.endElement("div");
    }

    @Override
	public void encodeChildren(FacesContext context, UIComponent component) throws IOException {
		//Rendering happens on encodeEnd
	}

    @Override
	public boolean getRendersChildren() {
		return true;
	}
}
