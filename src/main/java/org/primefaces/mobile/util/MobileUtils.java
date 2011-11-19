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
package org.primefaces.mobile.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.faces.context.FacesContext;

public class MobileUtils {
    
    public static boolean isMobileDevice(String userAgent) {
        Pattern pattern = Pattern.compile("(Android|iPhone|iPad|iPod|BlackBerry|Opera Mobi|Opera Mini|IEMobile)");
        Matcher matcher = pattern.matcher(userAgent);
        
        return matcher.find();
    }
    
    public static boolean isMobileDeviceDetectionEnabled(FacesContext context) {
        String value = context.getExternalContext().getInitParameter(Constants.MOBILE_DEVICE_DETECTION_PARAM);
        
        if(value != null)
            return Boolean.valueOf(value);
        else
            return false;
    }
}
