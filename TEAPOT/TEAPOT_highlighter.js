// ==UserScript==
// @name         TEAPOT Highlighter
// @version      0.3
// @namespace    dithpri.RCES
// @description  Adds TEAPOT's icon besides members during auctions
// @author       dithpri + slight edits by y0.
// @downloadURL  https://gist.githubusercontent.com/NS-y0/GovTools/raw/master/TEAPOT/Teapot_highlighter.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*/*card=*
// @match        https://www.nationstates.net/*card=*/*page=deck*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      docs.google.com
// @connect      googleusercontent.com
// ==/UserScript==

/* Copyright notice:
 * This file is modified from a file in dithpri's RCES and used under the MIT license.
 * To see the MIT license in full, go to https://github.com/dithpri/RCES/blob/master/LICENSE.md
 *
 * My modifications to the Software are released under the Apache License 2.0
 * To see the Apache License 2.0, go to https://github.com/NS-y0/GovTools/blob/master/LICENSE.txt. 
 *
 * The image was created by *The Atlae Isles*. If you have any questions regarding image use, contact them by telegram.
 */

/* Permissions:
 *
 * GM.xmlHttpRequest, connect docs.google.com, googleusercontent.com:
 *     to automatically fetch and update members' nations.
 *
 * GM.setValue, GM.getValue:
 *     to save and load members' nations locally.
 */


function GM_addStyle(style) {
	'use strict';
	var node = document.createElement('style');
	node.innerHTML = style;
	document.getElementsByTagName('head')[0].appendChild(node);
};

const icon_base64 = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAYAAABU1PscAAABgmlDQ1BJQ0MgUHJvZmlsZQAAKM+VkTlIA0EYhT/jFUSxMIKIxRZqpSAqYilRDIKCJBHiUbi7MQdk17AbsbEUbAULj8arsLHW1sJWEAQPECtLK0UbkfWfjZAgRHBgmI838x4zbyBwkDMtt6YPLLvgRCNhLTE7p9U/U0eQVmrp0E03PxUbj1NxfNxSpdabXpXF/0ZTcsk1oUoTHjHzTkF4UXhotZBXvCMcMjN6UvhUuMeRCwrfK90o8ovitM8BlRly4tFR4ZCwli5jo4zNjGMJDwp3Ji1b8gOJIicVrym2civmzz3VCxuX7JmY0mV2EGGCKabRMFghS44CvbLaorhEZT9cwd/u+6fFZYgriymOMZax0H0/6g9+d+umBvqLSY1hqH3yvLcuqN+Cr03P+zz0vK8jqH6EC7vkXz6A4XfRN0ta5z40r8PZZUkztuF8A9oe8rqj+1K1zEAqBa8n8k2z0HINDfPF3n72Ob6DuHQ1eQW7e9CdluyFCu8Olvf25xm/P8LfNCJyjrpuTnoAAAAJcEhZcwAAHYYAAB2GAV2iE4EAAAuHSURBVFhHtVgHdFRVGv7em3nTJwlJIBA0gEsLGhQEFonKYRFBV2ygrIAgHhaR4sG2seuKoIiAworlbLIKsuJGsOAxS8SC9CYlSAkgIooQiYTp783Me/vdNzMhFT0rfsmdct+9//37/9+RDAK/E77cvA49L7wYHrcnOXPu8bsJIGVJgJUjbKBTjwJUrt6VfHJuISffzykOffcNEAXcmS3hbtsKBzZUJJ+ce/xmC+i6DllurAcp1wm30wWQuqqqiP4QSD5JIHWsJNFKvwHnzIWOVf+Il8pKULL2XVSfrkZOdiYCMZoBEnRDR9QXxGVd/4gbewzCvUP/mth0DiDF43GjKQ3+WpRuLEfx54uwcueX/GbAaXfBIuhRs5JQv3iljsQnLaYhqoXptwomDRmLUYU3oG/nS00rcVmTCAWD2HegElbFiu4XFiRnz+A3WeDyp8dg3c6PYHVmwG61QSbTKWLCM/w1fHEAXo7UMYLPOC0SoiCoqcbiosUY3f9m81ld7NuzF7ffNx5bt6znBk6I7QrwyX8+wVV/uqrWdeURU8ZAkqktT3K4OLIlVFLq5rDtcAWkq2VsqlwLT1oOHIo9EQemP9NlOPxHZPheVjGxrw5/tXiUeCbWWGQLvHYPPDl5uH3BRBRM6mPSFVi/YQPadG+H/MJu+KqSmcvjpBJI22UFnA4MumEQ7iqaWht30uYdW4w+hb3hPr9V4nwirEZQ0DEf21duTEzUwdI1H+C2+RPh9qSTHf6lNhFCyTGONMnAq6NiuOmqGPSAhL+XWvD0ewrSW1KZuilDLYRlgtEI8klvxo3TMXz8bZAcVtisCvRoDHeNGo8+3S+FL+zH0ePHMHPOdCisKw9OmIYZRU8lXKj8s1UYfP0gePJaJckCgWNVWFr8DkYMuzU5A+w6uhcX3zcALnc63UWuzzwHeUPoiISdL6nonh9HwCdRUwZc6QbumGHHmxupeR5BD2okhGbEEY9oUHb4YeFf8OhPmP38XDww+d7kqgSkTAnOllkIf1MNI2qciYEnZ03H03OegCe7lcmMMJB/b5VJPM4JCw+UhtjhbtOhkeYF/BG+nCIzZWHEQ8KKEjxeA7pGocTnFjo+WqVg6EwbPB14sJC2LgmeY/AQ6WcN/i8PY1nJu7j5+puSD8/AH/AjLTcNsNGVy7YkCplg8u9Fj6NjfgGiUaY+QUw8yKDJtZjJ/IOLpgMtcppmPggMOI+u8FYEmp95nyQEw+NftKF8p8UUJHBKwnX9Y1g3U0WgSgLl4jnm9gQETQplZNmBbCXBfEK39eD1eFHQt7ep0R37dycESDE0dthoqJGQ+V1sldLdmPzIPdCo0hfee4nx5KaPJ9aK52IIzffJMvDZUxEodgMxMuFKB+YssqN4jQVD59qxt5JCcC7IWtavTxxrH41CPWkW61oexVtMfNENyJe0SUw2UFQKw6+lcJoBi8VSv5W4ZfD1QEA1P4utbpcbrxW/ghHPT4OSnoHACQm9PAb8PydoB36i0F11bFoYRpjciAAVzPd+wIkHPqS/ZwF2ar/bNDuWlitwt6AlfEBhzyhCJSpiFIJ8IBIjLbpfF/ZO9BDo6mmTh+aQ1CGysrPrC9ClS1ek57ZBLEaKhFCIl4tWbC5DtNqOtydGsWa+ipI7Y/AflvDksDjeeFxFkPnexhztUCRcNMWJrUe5j24qwIQEL93rtoVWzKBVPHTLIGPE7mEteEtFnktHS8XA18+o2DE/jCGdqIWQHeUVaxMEmsAPx74330WRqyeAwMhrh0HV1IQL8dWwyYhb0rBoQhR/GWoaHVf3iOG526N46g4NQSrLyYBCTEbeZAf28LvXLSglICwlaHmzgceWWzB6pgPuDLoadaSkx9Ga6hQu1a2jDpVzZTMiuKijgvc3r0wQaAKfrl/NThfIyWpgAQG7w8E0J1JEwgKSw4L0TGDMXAWxUzKeXKRg+UYrisZFTbO72a99d5zNwZ12HCcDbhJuCGFxUwjSWVIhoXCyEydrLOg00oM1r4TRtlUcQRZmuxcYN8uO3UcVHDy2z9zbEF9VbMc327+m+oH+/fo3FuDaQUMYXcwRqehitIs06vyDgfyJTlzZ2cDUYYJ5pkbeU9Yxy3SmjxvChch8M3FXK0QaC+v6QxIeLFGwa2EQkdOkT3250yQUzWesbGIVoJupmsjLjTFiylgSsaDX5f1M3hoJ0DYnV/TIyW8ESys7DYQPSqigtgb2iiHAQz0MyMXlVpR8ouDE6xSYGlTZs6TkbggxLYTw0cVGX6FjCWOHtdAc7BDQbqwLs+5RMWkQCxot63JS0gbYuusrHNxegXRvS6woKTXn6gkg6kG3LvnMjSw0VKXpv+TKx6zzr2kaHJkMPDIqcvyU5+zIchkofiSM9LQ4YotVtLYwm4gwaQBTKA7RE03/s47Fj0YQ9Bmwcj10Cff/w4YjiwOIsZ7MuVtD+9Yaena90tybwq2TRqN330TnWvbmMrRuS0UT9QSoLVDJN/NcLY50WxTj/mnD66UKXGz2Xlxqw8ufWvDFQXJgyAiLqmTRceTlMC5mTRCFLQUzjkhPxMur42J47E4WMrqfi1oPhWS0usuJ0v0yNmxWINPwV9zvwLc+F95ZVIzZr8zDswvnQMqRULpsKextW2Db51txWV+6TxJNttPD7x6FZe+9w7zNqGMAyB0ZXec54T9hoAuzyX4y422R0OhAtgWr5rEO0K0Eow6mzyuKHFh7QIKXvsy6hOB3zDSzoijspdXGzs9VMrIY+A6hSK6J1ADdSHMPXd+bYUH00x8RCVETwn9FTJLQuuVr0K/wDPMCzd4HBoy4Bl9sXM1roQeyl9F5KYXRdLPSWuvYzU/aF9AQ+xaokGkF0Ua4yHjxuzaMf8OCNDJ7cLaKljk6mLaZQpHoieZb4WJ3yl4vAfIpkoVJm7EUW30cEUODURPEvBcWYNr4KYl1DdCsADv27MLAW69hGxtgdrFB6kLVthIplvGRXJOCn3HRp7WBsr9p8Hp13rwSjE6dr+CWQh1XFrAzJfNC8+XrLRj8gp0dJVsBnpzyWgGzA6PGI9uqEDvuw4SxEzG47wDcfGPjpi6FZgVIwd4hA1qVqE42eId3hhGKNxJAIERLxI+TiVWUhv8BuoJgOC4SlJboRt/+2IaRcxR42/FIcWpd5smGytY1+oMfHX1ZOLB5b/LJ2VEviJuCergGRtDA7Meeg/+t3QiEfMzbcfPAuhDV2J1Hnga4sP5rNm+0QICXGVFdBfPXPezAyNes8LZPdroNmA+oIVyQ2Z4KqPrVzAv8ogXq4uSPVSg/uBGjX50Gl41uJf7q+ICgxKwIO535xeFxjBlKjfpkPLREwdyVjAc2d6LE1HMbborwfpyXmYNDCzbVztWlezacVYDmfvPZcWQPejw0kKmQN7MmhBAEg99L+Hahikfft2LJBtnMSOJZQ+bDDNQebTphy7P/Tc7Wxy8J06wAYtocDNplH3+Af68oxbbd22Cj5p0WO3Ja5mC/+yeclE4zGGVmE2EPgocJiuJMP1tjmfcTt2j2BMyTeEvjq84rmc4U1FXLRUaAfVTNCVpCNZXWvWsBOuSejwXPzDMvWIrCPqUZNCtASvvLV7yPMUUT0Kn9BbwNJXtkAW6TeXetsYdRbQvilBQiY9xDH6rVl/hQh7rO3jrO4ZYcyNRcyIy74FKtiFGYlJZFhGiqhn2HKrHyjQ/Qt9eZXyyawlktICAI79i9Ex9/vhJvf1iKQDgonIb9PlMMlwjNCwvEHRJOOVWcVPzQJPYz5o85ZIoMC1J22QZ3jO1HzIU0dqK6uYLPuETTeENTqX3e9lvw4tTzwkvwxNSH0S4vz+Tj/3IhgbNt3rm3Ag476wLXiKvdvsp9OHz4sMlMkHdH2SLjtM9P81vh4c1OXJIUh40KCGHimPFsn0PmD2E69+flnmfe/hpCMNY86wLA/wBVAfml3BHrkgAAAABJRU5ErkJggg==';
(async function () {
	'use strict';

	const update_auctiontable = async function () {
		const members_array = (await GM.getValue("TEAPOT", "")).split("\n");
		document.querySelectorAll("#cardauctiontable > tbody > tr > td > p > a.nlink").forEach(function (el, i) {
			const canonical_nname = el.getAttribute("href").replace(/^nation=/, "")
			if (members_array.includes(canonical_nname)) {
				el.parentNode.parentNode.classList.add("rces-cl-TEAPOT");
			} else {
				el.parentNode.parentNode.classList.remove("rces-cl-TEAPOT");
			}
		});
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		if ((await GM.getValue("TEAPOT-lastupdate", 0)) + 12 * 60 * 60 * 1000 < (new Date().getTime())) {
			GM.xmlHttpRequest({
				method: "GET",
				url: "https://docs.google.com/spreadsheets/d/1Mmrkwmvl47FHqAaAi1G6wKDr4F5nEwKqVzH7AXNgvRI/export?format=tsv&id=1Mmrkwmvl47FHqAaAi1G6wKDr4F5nEwKqVzH7AXNgvRI",
				onload: async function (data) {
					console.info("updated");
					await GM.setValue("TEAPOT",
						data.responseText
							.split("\n")
							.map((x) => x.split("\t")[1].trim().toLowerCase().replace(/ /g, "_"))
							.slice(1)
							.join("\n"));
					GM.setValue("TEAPOT-lastupdate", new Date().getTime());
					update_auctiontable();
				}
			});
		}

		update_auctiontable();

		let observer = new MutationObserver(function (mutationList) {
			update_auctiontable();
		});

		const observerOptions = {
			childList: true
		};

		observer.observe(document.getElementById("auctiontablebox"), observerOptions);

		GM_addStyle(`.rces-cl-TEAPOT {
background-repeat: no-repeat;
}
tr > td.rces-cl-TEAPOT:nth-child(1) {
background-image: linear-gradient(90deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255,255,255,0) 100px), url('${icon_base64}');
background-position: left;
}
tr > td.rces-cl-TEAPOT:nth-child(5) {
background-image: linear-gradient(270deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255, 255, 255, 0) 100px), url('${icon_base64}');
background-position: right;
}`);
	}
})();
