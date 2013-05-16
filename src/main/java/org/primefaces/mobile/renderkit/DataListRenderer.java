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
import java.util.Iterator;
import java.util.Map;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import org.primefaces.component.datalist.DataList;
import org.primefaces.component.separator.Separator;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.WidgetBuilder;

public class DataListRenderer extends CoreRenderer {
             
    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        DataList dataList = (DataList) component;
        String clientId = dataList.getClientId(context);
        Map<String, String> params = context.getExternalContext().getRequestParameterMap();
        Boolean loadMoreRequest = Boolean.valueOf(params.get(clientId + "_encodeFeature"));

        if (loadMoreRequest) {

            int scrollOffset = Integer.parseInt(params.get(dataList.getClientId(context) + "_scrollOffset"));

            encodeLoadMore(context, dataList, scrollOffset);
        } else {
            encodeMarkup(context, dataList);
            encodeScript(context, dataList);
        }
    }
    
    protected void encodeMarkup(FacesContext context, DataList dataList) throws IOException {
        ResponseWriter writer = context.getResponseWriter();        
        UIComponent header = dataList.getHeader();
        UIComponent footer = dataList.getFooter();
        String type = dataList.getType();
        Object filterValue = dataList.getAttributes().get("filter");          
        Object autodividers = dataList.getAttributes().get("autoDividers");
        Object autoComplete = dataList.getAttributes().get("autoComplete");
        Object icon = dataList.getAttributes().get("icon");
        Object iconSplit = dataList.getAttributes().get("iconSplit");
        String iconType = (iconSplit != null && Boolean.valueOf(iconSplit.toString())) ? "data-split-icon" : "data-icon";

        writer.startElement("div", dataList);
        writer.writeAttribute("id", dataList.getClientId(context), "id");
        writer.startElement("ul", dataList);        
        writer.writeAttribute("data-role", "listview", null);
        
        if(filterValue != null && Boolean.valueOf(filterValue.toString())) writer.writeAttribute("data-filter", "true", null);
        if(autodividers != null && Boolean.valueOf(autodividers.toString())) writer.writeAttribute("data-autodividers", "true", null);
        if(autoComplete != null && Boolean.valueOf(autoComplete.toString())) writer.writeAttribute("data-filter-reveal", "true", null);        
        if(icon != null) writer.writeAttribute(iconType, icon, null);        
        if(type != null && type.equals("inset")) writer.writeAttribute("data-inset", true, null);
        if(dataList.getStyle() != null) writer.writeAttribute("style", dataList.getStyle(), null);
        if(dataList.getStyleClass() != null) writer.writeAttribute("class", dataList.getStyleClass(), null);

        if(header != null) {
            writer.startElement("li", null);
            writer.writeAttribute("data-role", "list-divider", null);
            header.encodeAll(context);
            writer.endElement("li");
        }

        if(dataList.getVar() != null) {
            int rowCount = dataList.getRowCount();

            if (dataList.isPaginator()) {
                rowCount = dataList.getRows();
            }

            for(int i = 0; i < rowCount; i++) {
                dataList.setRowIndex(i);

                writer.startElement("li", null);
                renderChildren(context, dataList);
                writer.endElement("li");
            }
        }
        else {
            for(UIComponent child : dataList.getChildren()) {
                if(child.isRendered()) {
                    writer.startElement("li", dataList);
                    
                    if(child instanceof Separator) {
                        writer.writeAttribute("data-role", "list-divider", null);
                        renderChildren(context, child);
                    }
                    else {
                        Object iconLi = child.getAttributes().get("icon");
                        if(iconLi != null) writer.writeAttribute("data-icon", iconLi, null);
                        child.encodeAll(context);
                    }
                    
                    writer.endElement("li");
                }
            }
        }

        if (footer != null) {
            writer.startElement("li", null);            
            footer.encodeAll(context);
            writer.endElement("li");
        }

        writer.endElement("ul");
        
        if (dataList.isPaginator()){
            encodePaginatorButton(context, dataList);
        }            
        
        writer.endElement("div");
    
        dataList.setRowIndex(-1);        
    }
        
    protected void encodePaginatorButton(FacesContext context, DataList dataList) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String clientId =  dataList.getClientId(context) + "_btn";
        Object paginatorText = (dataList.getAttributes().get("paginatorText") == null) ? "More" : dataList.getAttributes().get("paginatorText");
        
        writer.startElement("a", dataList);
        writer.writeAttribute("id", clientId, null);        
        writer.writeAttribute("data-role", "button", null);
        writer.writeAttribute("style", "margin-top: 30px", null);        
        writer.writeText(paginatorText, null);       
        writer.endElement("a");        
    }  
    
    protected void encodeLoadMore(FacesContext context, DataList dataList, int scrollOffset) throws IOException {
        ResponseWriter writer = context.getResponseWriter();

        for (int i = scrollOffset; i < (scrollOffset + dataList.getRows()); i++) {
            dataList.setRowIndex(i);

            if (dataList.isRowAvailable()) {
                writer.startElement("li", null);
                renderChildren(context, dataList);
                writer.endElement("li");
            }
        }
        
        dataList.setRowIndex(-1); 
    }    
    
    protected void encodeScript(FacesContext context, DataList dataList) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        String clientId = dataList.getClientId(context);
        WidgetBuilder wb = getWidgetBuilder(context);
        UIComponent footer = dataList.getFooter();
        boolean hasFooter = (footer != null) ? true : false; 
        wb.widget("DataList", dataList.resolveWidgetVar(), clientId, true)
                .attr("isPaginator", dataList.isPaginator())
                .attr("hasFooter", hasFooter)
                .attr("scrollStep", dataList.getRows())
                .attr("scrollLimit", dataList.getRowCount());
        startScript(writer, clientId);
        writer.write(wb.build());
        endScript(writer);
    }    
    
    @Override
    protected void renderChildren(FacesContext context, UIComponent component) throws IOException {
        ResponseWriter writer = context.getResponseWriter();
        for (Iterator<UIComponent> iterator = component.getChildren().iterator(); iterator.hasNext();) {
            UIComponent child = (UIComponent) iterator.next();
            Object iconLi = child.getAttributes().get("icon");
            if (iconLi != null) {
                writer.writeAttribute("data-icon", iconLi, null);
            }
            renderChild(context, child);
        }
    }
    
    @Override
    public void encodeChildren(FacesContext context, UIComponent component) throws IOException {
        //Do Nothing
    }

    @Override
    public boolean getRendersChildren() {
        return true;
    }
}
