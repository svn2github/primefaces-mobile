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
import org.primefaces.component.inputtextarea.InputTextarea;
import org.primefaces.mobile.util.MobileUtils;
import org.primefaces.renderkit.InputRenderer;
import org.primefaces.util.ComponentUtils;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

public class InputTextareaRenderer extends InputRenderer {

    @Override
	public void decode(FacesContext context, UIComponent component) {
		InputTextarea inputTextarea = (InputTextarea) component;
        String clientId = inputTextarea.getClientId(context);
        String inputId = inputTextarea.getLabel() == null ? clientId : clientId + "_input";

        if(inputTextarea.isDisabled() || inputTextarea.isReadonly()) {
            return;
        }

        decodeBehaviors(context, inputTextarea);

		String submittedValue = (String) context.getExternalContext().getRequestParameterMap().get(inputId);
        
		inputTextarea.setSubmittedValue(submittedValue);
	}

	@Override
	public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
		InputTextarea inputTextarea = (InputTextarea) component;

		encodeMarkup(context, inputTextarea);
		encodeScript(context, inputTextarea);
	}

    protected void encodeScript(FacesContext context, InputTextarea inputTextarea) throws IOException {
        String clientId = inputTextarea.getClientId(context);

        WidgetBuilder wb = getWidgetBuilder(context);
        wb.initWithDomReady("InputTextarea", inputTextarea.resolveWidgetVar(), clientId);

        encodeClientBehaviors(context, inputTextarea);

        wb.finish();
    }
    
    protected void encodeMarkup(FacesContext context, InputTextarea inputTextarea) throws IOException {
		ResponseWriter writer = context.getResponseWriter();
		String clientId = inputTextarea.getClientId(context);
        String label = inputTextarea.getLabel();
        String inputId = label == null ? clientId : clientId + "_input";

        if(label == null) {
            encodeInput(context, inputTextarea, inputId);
        } 
        else {
            writer.startElement("div", inputTextarea);
            writer.writeAttribute("id", clientId, null);
            writer.writeAttribute("data-role", "fieldcontain", null);
                        
            writer.startElement("label", null);
            writer.writeAttribute("for", inputId, null);
            writer.writeText(label, "label");
            writer.endElement("label");
            
            encodeInput(context, inputTextarea, inputId);
            
            writer.endElement("div");
        }
	}
    
    protected void encodeInput(FacesContext context, InputTextarea inputTextarea, String inputId) throws IOException {
		ResponseWriter writer = context.getResponseWriter();

		writer.startElement("textarea", null);
		writer.writeAttribute("id", inputId, null);
		writer.writeAttribute("name", inputId, null);

		renderPassThruAttributes(context, inputTextarea, HTML.INPUT_TEXTAREA_ATTRS);

        if(MobileUtils.isMini(context)) writer.writeAttribute("data-mini", "true", null);
        if(inputTextarea.isDisabled()) writer.writeAttribute("disabled", "disabled", "disabled");
        if(inputTextarea.isReadonly()) writer.writeAttribute("readonly", "readonly", "readonly");
        if(inputTextarea.getStyle() != null) writer.writeAttribute("style", inputTextarea.getStyle(), "style");        
        writer.writeAttribute("class", createStyleClass(inputTextarea), "styleClass");

        String valueToRender = ComponentUtils.getValueToRender(context, inputTextarea);
		if(valueToRender != null) {
			writer.writeText(valueToRender, "value");
		}                     

        writer.endElement("textarea");
	}
    
    protected String createStyleClass(InputTextarea inputTextarea) {
        String defaultClass = "";
        defaultClass = inputTextarea.isValid() ? defaultClass : defaultClass + " ui-focus";
        
        String styleClass = inputTextarea.getStyleClass();
        styleClass = styleClass == null ? defaultClass : defaultClass + " " + styleClass;
        
        return styleClass;
    }       
    
}
