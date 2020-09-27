// ==UserScript==
// @name         TEAPOT Highlighter
// @version      0.4
// @namespace    dithpri.RCES
// @description  Adds TEAPOT's icon besides members during auctions
// @author       dithpri + slight edits by y0.
// @downloadURL  https://github.com/NS-y0/GovTools/raw/master/TEAPOT/TEAPOT_highlighter.js
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

const icon_base64 = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSotgnaQ4pChOlkQFXHUKhShQqgVWnUwufQLmjQkLS6OgmvBwY/FqoOLs64OroIg+AHi5Oik6CIl/i8ptIjx4Lgf7+497t4BQqPMNKtrHND0qplKxMVMdlUMvKIXEQwggJDMLGNOkpLwHF/38PH1LsazvM/9OUJqzmKATySeZYZZJd4gnt6sGpz3icOsKKvE58RjJl2Q+JHristvnAsOCzwzbKZT88RhYrHQwUoHs6KpEU8RR1VNp3wh47LKeYuzVq6x1j35C4M5fWWZ6zSHkcAiliBBhIIaSiijihitOikWUrQf9/BHHL9ELoVcJTByLKACDbLjB/+D391a+ckJNykYB7pfbPtjBAjsAs26bX8f23bzBPA/A1d6219pADOfpNfbWvQI6N8GLq7bmrIHXO4AQ0+GbMqO5Kcp5PPA+xl9UxYYvAX61tzeWvs4fQDS1FXyBjg4BEYLlL3u8e6ezt7+PdPq7wcg/nKGYU3D7wAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QJGhIfHyxFUssAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAKcUlEQVRo3u2Zf7CcVXnHP88577777u67e3/svTchZDAYCW4sDhg6SQQLqAxIpYxFhKpQGZuxE8WRGW2rtLbjWKBTauyMAUGkFdtaQxjFoFZ+VEgr4KixleldGtIEjOTHvXf33v39433POf3jvcnNzb3JhJbMtDP3O7Pv/nh3z/l+n/M8z3mes7CEJSxhCUtYwunCgP9OAsL/n+SHcYxpRx7HmZnK6ZrGOy2jDuo3EBkIA0MAHGoNny4B8hqMoQC74NMzAodzBgdYJ0z29f9VAQlWeSs4I/t5Vg1+gDhO4bseqXQqmcJBsyt03YscaG9jV+Ozr6WAxS14qrhg7GaWxx+nkDsfHCAGAUQA60DAIYiAtYIzCiOOic5DVLtb+Y/OzpMNPwS56ZT6NbREdM2u13YFfuvs3Xgz5+DlLEocODfLHMQ5unmPAKAZ447MNfsdQTNTgV/pzTzfuOf4oVPo86Ki2oGLXodJFpEUUONqYh49YnjFSPppNI7c7CODo4hD88YTEj+/sIHLtSOIVuOHBiUOwSXcBUTD4YI388Vy7cpV5Qqt0ENIVkMEBIcjZqBoWBPczWWZQ3MRpS5lWaYTDZpfkNVnEWYg8CCbgkwAATsYTD9yxGs0ntuNdh+mmDNkfUfOd/gpIa2vpRX/1QLy52U3sSZ8hPygOUrmyDo6EcQTOo34gd97ub5hA977fx11YGqqtevFM3P4PQtKmNWZOLDnCLMhy7sf5bB6hSHvEdJKk/YtFqjH/0jbbSWWHxG7vWTUOjLeOTjOpG8fTaYOvGvQ8bcp5sxRorWWpqs20bP3z/l7/i2szv4MzzezDuiO8UZBFBzK6uf+Ynxm/QXo+jROayQ3BJdspr9zf6lIoRljRRA391uHoLTQj4SfzjiMc1TaGrw7aMefOS4oHGHWcKitiRAFQDd+BFJ302npo4mxkI3p2a8AcKtLPh/r/YzUYuQBcppqRrsnxxsXlhLyhUEk40N9Cvf03fhfv7lc5WDeQ8369FwkOmxsSWtLKbS0+xqjfncBeYAOeWbamgKkUW9VR2+0oo/iZ6o4J0nyEGEQrmCjzxYxXFR4kKFls4nmOPIm9FbE5anm35br/Rp0+1AYQd75h/S3P4spDCL1Kfjg1aQeu218hnqo0Sk1X4QkXl3MCCMaevbBReOvS5NccBit6fmsV/NuNqMHcUaBJKsQBu4HuR9vW/8HZBlN3YhgkJTMzSgCoTdQK0+98jek/QwSWcgNwae+QP/JPaXi9V86p/DzX2AKw9CoweWXob//ifEqtbRKRMjceEoL1sJ5o+6k2a9jttE3oMTMF1CLv0Kzl7y2gNKWlL3mx8+OPEE2a6mFerS2t0o79BDnaOT0xWG5MvNPpNt9iGfJh9fSveuZUpFcMyYXubf80drBrQ8R5UegPg1Xvo1U675yjSkFyhdcWtHJ6fSBfRWinCZunTy9ayWzz4fUcbfGyYfxvP0hCGIGvQ3U82rrDeXqxA78v/ztxJc//Bvlyr/ci9+oQNqHjI/z3kW35ZVG8ZtxYggLI434Y39fGt78BfqFIjQaEAyg+t/Y06C+b4bOZHfXn5Rr3UcJVgflCu00nD9wzQkFWHtWEvw2VAtuVtrfwRpJAs1BoAV/WLa8b7y6+UZSgLz3YrxPXDVevf9T+I0q5AIgwsp1eW2G1oygZ8kf2dAQIWzG9+wsFTduppcvQhxBagg12jf2hTtr/QvehOpFsOdB/MHCoRYD3k0nFFDwL8EDFZsDCwWI6iIytwK+cmQa8a0PrB2Op3CbthDd/zjxlk+Sqk9BPg979mO9m9cUKCzL4LqLlCWzIrLN+Lnp0sjIVfQOTmHkrUE08QPSZ69AN5qQHoBLP05/pvf6HH60elHyoVpPpTVAG0z/1scXEcA3iaKkjAHQklxWtk3qN9PxVW+Gz28iVZ/CFQbgsWcw5976hjyBFqRn5+X3xURIM67Y0sj1dxC3dnRTnekkdvJDuN/5DP2n975+iHzswAWLN0np71HwIEi9LGwxCwXEbt9R8sl7EOvYn9XtHT3vPZeQqldxhRHki9uIbt9GPHHfnjodgPQxWWWBZQScoxd6G88uV567D180KAXZLMgVA+obt+O/98K909Q9Adte6DqpDdQ7w5COw6q7+MiWdVyeNc/TMHNxHFmhHXp3fWi8mhlDWq0kx7/7FvrLC6in7iZdHEbHXyvXqB1uo3ML634nyc7RCr2PXFiuPHMPfmMaSWnA4q77Y/ru8ZqLG/DQn+H73t42DPxk3hgj/k6i6FkcqMnW5U3iXy0u4NgaVYC+gbgaf3L72uHb7yXKhbhPbyX67gtri9/+dwwO1+oCHso91HBBozyFCb155MU5Ojn9ufeUq1/+NH59CsIsNJvY4ENnZbfvDoMnfkikLIxdS6/vr8ky0XwfBf9Ohvy7GMOh7NsYydpUU220MU+dvJweTf8rylxE2jcYB6tDx+syUMt51HZXGF5TJNOMaYXeSilP7f8W6fZ04iSZQRi7gd5kvzRC0IxBC4ez+vufHa9eeUkS+IUBmHgFu+wjpQFGe0nR1k4rqZQn3crSKEEn5p+nFCZWKCGJSVAT9u0W+8NT6wdGg3EyUsKJIacd64ehb8FpQcxckKjQ4+BLtf7DHZRGdfuQK8Lt99K/bUepiG7GB7bsb52xEtWoQ74If/cw0Y1fKw1T6BisPYaJAjEOAzw1KaRQNLqC9T5HI/7TV9dS5vU6CulnUU5jcazNO8YCsCTBOM/HQ2+gW57a/dekhgZR3Sghes1tRL9/BepdG9D1emL57Y9hrvvy2kEK7YT8/KwlKIF/mxEqXUVPf4d672HMCeqiU+rIVmQMMx1F3od3r4hp24UCAFygmfTEPVFu0IZ6OyFsutDqJVnrS/9AdMtX1w6zrBHPFoXMK6nFCRM9xc9nqlSj4qmeKJwcBzqaNkLd3sH2lzys0bh5bcysKXqWZR0jl63NP/4TTKEI9RquGydZq/RB+rd8szTM8kY821IeR140XTfNk5NyquSTjuxUEdsnR3v5+9qp6EWKwdUoXDLxcUQKsfv6j4LUQL/ZuXQjWnq4G+4k2vnLUpHwBM2MMUIU1fnWwVd9fiSnsEILS4M35ddxXu6niG+SDfaYyt7NdmaTWb17y/jMTV/FPPdyqUjQjI+m1GPJe6KYbv2S71ZWnY5zIXUu56r/zL50Exm1iVC9GSGibXoYpriouIoBHWBwye7tksb+CNEo9PBih3TNLOHkIkoQB54IzzcO83JzhiA1hsZHoejaF+jG/0Utvn72LCL6nwhIrJ/RN7Es/QB9O4GVxjHWA2sNKzKDrMwOMOinwSbrdcTIclzrqAS0CH1nONBpcLjXoNJp43l6PhNJk5YzOdR5Bz27839/MhfodfjyfjLeB/BVFsThTBsHGByRjcn7HiszIcvTWTwRlJPkGMWBE3DK0TQxB9sN9jWaCIqU8lAioDyU+Ek7S5NOtIu6/RjGvHT6jhbzqXUoaeOMINoQ2/OxroQVH1weMCgZxrk+1tYRlcKjj5I8lj8HlUeMwWmN39/HNK2l/yOWsIQlLGEJrxb/DZCFlalkjFUzAAAAAElFTkSuQmCC';
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
		document.querySelectorAll("a.nlink:not(.rces-cl-TEAPOT-parsed)").forEach(function (el, i) {
			const canonical_nname = el
			.getAttribute("href")
			.replace(/^nation=/, "");
			if (members_array.includes(canonical_nname)) {
				const new_el = document.createElement("span");
				new_el.classList.add("rces-cl-TEAPOT-inline");
				el.parentNode.insertBefore(new_el, el);
				el.classList.add("rces-cl-TEAPOT-parsed");
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
			subtree: true,
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
}
.rces-cl-TEAPOT-inline {
background-repeat: no-repeat;
background-image: url('${icon_base64}');
background-size: contain;
padding-left: 1.5em;
}`);
	}
})();
