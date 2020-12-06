const puppeteer = require('puppeteer');
// https://m.so.com/s?src=hotlist&q=%E6%9C%B1%E6%AD%A3%E5%BB%B7
//J https://m.so.com/s?src=hotlist&q=%E4%B8%81%E7%A6%B9%E5%85%AE
(async () => {
    let continueCounter = 0
    let voteCounter = 0
    for (let step = 0; step < 5000; step++) {
        const browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.setCacheEnabled(false)
        page.setDefaultTimeout(0)
        await page.goto('http://m.so.com/mhtml/zt/hotlist.htmlDescription:360?fbclid=IwAR2frh11uqudNho7OoC7AzzOD0WPuziVuGUQH7tI_5V_73VjYUOox4R1RQc')
        await autoScroll(page);
        await page.screenshot({path: 'example.png'});
        const text = await page.evaluate(() => Array.from(document.querySelectorAll('[href="https://m.so.com/s?src=hotlist&q=%E4%B8%81%E7%A6%B9%E5%85%AE"]'), element => element.outerHTML))
        let str = text[0]
        try {
            number = parseInt(str.split('image-').pop().substring(0, 2))
        }
        catch {
            continueCounter++
            console.log('Continue: ' + continueCounter)
            continue
        }
        console.log(str)
        let format = 'a[data-md="{\\"p\\":\\"vote-'+number+'\\"}"]'
        try {
            await page.click(format)
            await page.waitFor(200)
            await page.click(format)
            await page.waitFor(200)
            await page.click(format)
            await page.waitFor(200)
            await page.click(format)
            await page.waitFor(200)
            await page.click(format)
            console.log("Done " + number)
            voteCounter += 5
            console.log("Vote Count: " + voteCounter)
            console.log(new Date())
        }
        catch {
            console.log('Selector Error: ' + format)
            continue
        }
        await browser.close()
        }
        console.log('End of Execution, Continue Counter: ' + continueCounter)

}
)()


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0
            var distance = 1000
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance)
                totalHeight += distance

                if(totalHeight >= scrollHeight){
                    clearInterval(timer)
                    resolve();
                }
            }, 500)
        })
    })
}
