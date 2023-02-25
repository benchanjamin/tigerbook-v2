const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const loadCookie = async (page) => {
    const cookieJson = await fs.readFile('cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
}



(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await loadCookie(page);
    await page.goto('https://collface.deptcpanel.princeton.edu/');
    await page.waitForSelector('.btn.btn-secondary', {timeout: 3000}).catch(() => console.log('Class doesn\'t exist!'));
    await page.evaluate(() => {
        const button = document.querySelector(".btn.btn-secondary")
        button.click()
    })
    // Start getting student data

    await page.waitForSelector('ul.content-list img',
        {timeout: 5000}).catch(() => console.log('Class doesn\'t exist!'));
    const overallResults = await page.evaluate(async () => {
        async function waitForElm(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
        function delay(time) {
            return new Promise(function(resolve) {
                setTimeout(resolve, time)
            });
        }

        const resCollegesNodes = document.querySelector("#college-chooser-options")
            .querySelectorAll(".dropdown-item")
        // const validResCollegesNodes = Array.from(resCollegesNodes).slice(1, resCollegesNodes.length)
        let textResults = [];
        let imgSrcResults = []
        for (let i = 0; i < resCollegesNodes.length; i++){
            const resCollege = resCollegesNodes[i];
            if (resCollege.innerText === "All Residential Colleges") {
                continue
            }
            resCollege.click()
            await waitForElm("ul.content-list img")
            await delay(1000);
            const numberOfPages =
                +document.querySelector(".col-4.mt-auto.ml-auto.text-right.pr-0")
                    .innerText.split(" ").splice(-1)
            console.log(numberOfPages)
            for (let i = 1; i <= numberOfPages; i++) {
                await delay(1000);
                // await page.waitForSelector('ul.content-list img',
                //     {timeout: 5000}).catch(() => console.log('Class doesn\'t exist!'));
                await waitForElm('ul.content-list img')
                let pageTextData = [];
                let imgSrcs = []
                const students = document.querySelectorAll(".card.border-0.student")
                students.forEach((student) => {
                    const studentDivs = student.querySelectorAll("div")
                    const imgNode = studentDivs[0].querySelector("img")
                    const imgSrc = imgNode.src
                    const imgName = imgSrc.split("/").slice(-1)[0]
                    imgSrcs.push(imgSrc)
                    const nameAndYear = studentDivs[2].innerHTML.split(" ")
                    const name = nameAndYear.slice(0, -1).join(' ')
                    const classYear = nameAndYear.slice(-1)[0].replace("'", "20")
                    const email = studentDivs[3].querySelector("a").innerHTML.toLowerCase()
                    const trackAndConcentration = studentDivs[4].firstChild.nodeValue.split(" - ")
                    const track = trackAndConcentration[0]
                    const concentration = trackAndConcentration[1]
                    pageTextData.push({
                        name: name,
                        classYear: classYear,
                        email: email,
                        track: track,
                        concentration: concentration,
                        imgName: imgName,
                        resCollege: resCollege.innerText
                    })
                })
                textResults = textResults.concat(pageTextData);
                imgSrcResults = imgSrcResults.concat(imgSrcs)
                const nextButton = document.querySelectorAll(".btn-sm.btn.btn-secondary")[6];
                nextButton.click();
            }
        }
        return Promise.resolve([textResults, imgSrcResults])
    })
    await fs.writeFile("results.json", JSON.stringify(overallResults[0]))

    for (const imgSrc of overallResults[1]) {
        const imageFileDL = await page.goto(imgSrc);
        await fs.writeFile('./undergrad-images/' + imgSrc.split("/").slice(-1)[0], await imageFileDL.buffer());
    }
    // await browser.close();
})();
