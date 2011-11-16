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
package org.primefaces.mobile.utils;

import org.junit.Test;
import org.primefaces.mobile.util.MobileUtils;

import static org.junit.Assert.*;

public class MobileUtilsTest {
    
    @Test
    public void shouldDetectMobileDevices() {
        String userAgent = "Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Opera/9.80 (S60; SymbOS; Opera Mobi/1209; U; sk) Presto/2.5.28 Version/10.1";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9850; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.115 Mobile Safari/534.11+";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Mozila/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Geckto) Version/3.0 Mobile/3A101a Safari/419.3";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420 (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)";
        assertTrue(MobileUtils.isMobileDevice(userAgent));
        
        userAgent = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";
        assertFalse(MobileUtils.isMobileDevice(userAgent));
    }
}
