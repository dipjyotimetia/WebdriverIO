const { remote } = require('webdriverio')

let browsers;

(async () => {
    browsers = await remote({
        automationProtocol: 'devtools',
        capabilities: {
            browserName: 'chrome'
        }
    })

    await browsers.url('https://webdriver.io')

    await browsers.call(async () => {
        const puppeteerBrowser = browsers.getPuppeteer()
        const page = (await puppeteerBrowser.pages())[0]
        await page.setRequestInterception(true)
        page.on('request', interceptedRequest => {
            if (interceptedRequest.url().endsWith('webdriverio.png')) {
                return interceptedRequest.continue({
                    url: 'https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png'
                })
            }

            interceptedRequest.continue()
        })
    })

    // continue with WebDriver commands
    await browsers.refresh()
    await browsers.pause(2000)

    await browsers.deleteSession()
})().catch(async (e) => {
    console.error(e)
    await browsers.deleteSession()
})