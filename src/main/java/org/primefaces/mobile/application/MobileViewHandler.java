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
package org.primefaces.mobile.application;

import javax.faces.application.ViewHandler;
import javax.faces.application.ViewHandlerWrapper;
import javax.faces.context.FacesContext;
import org.primefaces.mobile.renderkit.MobileRenderKit;
import org.primefaces.mobile.util.MobileUtils;

public class MobileViewHandler extends ViewHandlerWrapper {

    private ViewHandler wrapped;
    
    public MobileViewHandler(ViewHandler wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public ViewHandler getWrapped() {
        return this.wrapped;
    }

    @Override
    public String calculateRenderKitId(FacesContext context) {
        String userAgent = context.getExternalContext().getRequestHeaderMap().get("User-Agent");

        if(MobileUtils.isMobileDeviceDetectionEnabled(context) && MobileUtils.isMobileDevice(userAgent)) {
            System.out.println("Match");
            return MobileRenderKit.RENDER_KIT_ID;
        } 
        else {
            return this.wrapped.calculateRenderKitId(context);
        }
    }
}
