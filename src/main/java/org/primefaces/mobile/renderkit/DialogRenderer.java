/*
 * Copyright 2009-2013 PrimeTek.
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
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import org.primefaces.component.dialog.Dialog;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.WidgetBuilder;

public class DialogRenderer extends CoreRenderer {
    
    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        Dialog dialog = (Dialog) component;
        
        encodeMarkup(context, dialog);
        encodeScript(context, dialog);
    }

    protected void encodeScript(FacesContext context, Dialog dialog) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String clientId = dialog.getClientId(context);
        Map<String,Object> attrs = dialog.getAttributes();
        String contentSwatch = (String) attrs.get("contentSwatch");
        String headerSwatch = (String) attrs.get("headerSwatch");
        WidgetBuilder wb = getWidgetBuilder(context);
        wb.widget("Dialog", dialog.resolveWidgetVar(), clientId, true);
        
        wb.attr("visible", dialog.isVisible(), false)
            .attr("headerText", dialog.getHeader())
            .attr("headerClose", dialog.isClosable())
            .attr("themeDialog", contentSwatch, null)
            .attr("themeHeader", headerSwatch, null);
            
        if(!dialog.isModal()) {
            wb.attr("showModal", false);
        }
        
        startScript(writer, clientId);        
        writer.write(wb.build());
        endScript(writer);
    }

    protected void encodeMarkup(FacesContext context, Dialog dialog) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String clientId = dialog.getClientId(context);
        String style = dialog.getStyle();
        style = (style == null) ? "display:none" : "display:none;" + style;
        String styleClass = dialog.getStyleClass();

        writer.startElement("div", dialog);
        writer.writeAttribute("id", clientId, "id");
        writer.writeAttribute("style", style, null);
        if(styleClass != null) {
            writer.writeAttribute("class", styleClass, null);
        }
                
        renderChildren(context, dialog);
        
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
