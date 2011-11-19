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
import org.primefaces.mobile.component.slider.Slider;
import org.primefaces.renderkit.InputRenderer;
import org.primefaces.util.ComponentUtils;

public class SliderRenderer extends InputRenderer {
    
    @Override
	public void decode(FacesContext context, UIComponent component) {
		Slider slider = (Slider) component;

		String clientId = slider.getClientId(context);
		String submittedValue = (String) context.getExternalContext().getRequestParameterMap().get(clientId);

        if(submittedValue != null) {
            slider.setSubmittedValue(submittedValue);
        }
	}

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        Slider slider = (Slider) component;
        String clientId = slider.getClientId(context);
        String valueToRender = ComponentUtils.getStringValueToRender(context, slider);

        writer.startElement("input", component);
        writer.writeAttribute("id", clientId, null);
        writer.writeAttribute("name", clientId, null);
        writer.writeAttribute("type", "range", null);
        writer.writeAttribute("min", slider.getMinValue(), null);
        writer.writeAttribute("max", slider.getMaxValue(), null);
        writer.writeAttribute("step", slider.getStep(), null);
        
        if(slider.isDisabled()) {
            writer.writeAttribute("disabled", "disabled", "disabled");
        }

        if(valueToRender != null) {
			writer.writeAttribute("value", valueToRender , null);
		}

        writer.endElement("input");
    }
}
