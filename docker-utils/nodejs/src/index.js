const CDP = require('chrome-remote-interface');
const file = fs = require('fs');
const viewport = [1440,900];
const screenshotDelay = 1000;
const targetURL="https://drupalcampgoa.org";

let device = {
    width: viewport[0],
    height: viewport[1],
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false
};

CDP(async function(browser) {
    const {DOM, Emulation, Network, Page, Runtime} = browser;

    // Enable events on domains we are interested in.
    await Page.enable();
    await Page.navigate({url: targetURL});
    await Page.loadEventFired(async() => {
        console.log("Page Loaded");
    });

    Page.loadEventFired(async() => {
        const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
        const {nodeId: bodyNodeId} = await DOM.querySelector({
            selector: 'body',
            nodeId: documentNodeId,
        });

        const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});
        await Emulation.setVisibleSize({width: device.width, height: height});
        await Emulation.setDeviceMetricsOverride({
            width: device.width,
            height:height,
            screenWidth: device.width,
            screenHeight: height,
            deviceScaleFactor: 1,
            fitWindow: false,
            mobile: false
        });
        await Emulation.setPageScaleFactor({pageScaleFactor:1});
    });

    try{
        let evaluation = await Runtime.evaluate({
            expression: `Promise.resolve(JSON.stringify(window.location.hostname));`,
            includeCommandLineAPI: true,
            awaitPromise: true
        });

        let location = JSON.parse(evaluation.result.value);
        console.log("Location : " + location);
    }
    catch (err) {
        console.error(err);
    }

    setTimeout(async function() {
        try {
            console.log("Async function started for screenshot");
            const screenshot = await
            Page.captureScreenshot({format: "png", fromSurface: true});
            const buffer = new Buffer(screenshot.data, 'base64');
            file.writeFile('/usr/src/app/screenshots/page.png', buffer, 'base64', function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Screenshot saved');
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }, screenshotDelay);

    setTimeout(async function() {
        let printOptions = {
            landscape: false,
            displayHeaderFooter: false,
            printBackground: true,
            scale: 1,
            paperWidth: 8.27,
            paperHeight: 11.69,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            pageRanges: ''
        };
        try {
            console.log("Async function started for pdf");
            const pdf = await Page.printToPDF(printOptions);
            const buffer = new Buffer(pdf.data, 'base64');
            file.writeFile('/usr/src/app/screenshots/page.pdf', buffer, 'base64', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('PDF saved');
                    browser.close();
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }, screenshotDelay);

}).on('error', err => {
    console.error('Cannot connect to browser:', err);
});
