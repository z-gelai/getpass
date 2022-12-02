const root_path = "", time_update_list = [];
let time_updater_init = !1;

function updateTime() {
    var e = new Date((new Date).getTime() + 288e5).toISOString().replace("T", " ");
    for (const t of time_update_list) for (const r of document.querySelectorAll(t.selector)) r.innerHTML = t.filter(e.slice(t.start, t.end))
}

let time_interval = 1e3;

function setDynamicTime(e, t = 0, r = 19, a = e => e) {
    time_update_list.push({
        selector: e,
        start: t,
        end: r,
        filter: a
    }), updateTime(), time_updater_init || (time_updater_init = !0, window.setInterval(() => {
        updateTime()
    }, time_interval))
}

function setUpdateInterval(e = 1e3) {
    time_interval = e
}

function setStaticTime(e, t = 0, r = 19, a = 0, n = 0, o = e => e) {
    for (const l of document.querySelectorAll(e)) {
        l.attributes["data-traceback-hours"] && (a = parseInt(l.attributes["data-traceback-hours"].value)), l.attributes["data-traceback-range"] && (n = parseInt(l.attributes["data-traceback-range"].value));
        var i = a + (Math.random() - .5) * n,
            i = new Date((new Date).getTime() + 288e5 - 3600 * i * 1e3).toISOString().replace("T", " ");
        l.innerHTML = o(i.slice(t, r))
    }
}

const presetFilters = {
    name: e => 2 == e.length ? e[0] + "*" : e[0] + "*".repeat(e.length - 2) + e.slice(-1),
    name_preferlastname: e => 2 == e.length ? e[0] + "*" : e[0] + "*".repeat(e.length - 2) + e.slice(-1),
    name_preferfirstname: e => 2 == e.length ? "*" + e[1] : e[0] + "*".repeat(e.length - 2) + e.slice(-1),
    lastnameonly: e => e[0] + "*".repeat(e.length - 1),
    firstnameonly: e => "*" + e.slice(1),
    lastcharonly: e => "*".repeat(e.length - 1) + e.slice(-1),
    idcard: (t = 2, r = 2, a = 18 - t - r) => e => e.slice(0, t) + "*".repeat(a) + e.slice(-r),
    phone: (t = 3, r = 4, a = 11 - t - r) => e => e.slice(0, t) + "*".repeat(a) + e.slice(-r)
}, fields = {};

function addStorageField(a, e, n, o, t = e => e, i = () => {
}) {
    var r = document.querySelectorAll(e), e = {selector: e, placeholder: o, filter: t},
        l = (a in fields ? fields[a].push(e) : fields[a] = [e], localStorage.getItem(a) || o);
    for (const c of r) c.innerHTML = t(l), c.addEventListener("click", () => {
        var e = window.prompt("修改" + n + "：", localStorage.getItem(a) || o);
        "" == e || null == e ? localStorage.removeItem(a) : localStorage.setItem(a, e), i(e || o);
        for (const t of fields[a]) for (const r of document.querySelectorAll(t.selector)) r.innerHTML = t.filter(e || t.placeholder)
    });
    i(l)
}

function initServiceWorker(a) {
    return new Promise((t, r) => {
        "serviceWorker" in navigator ? navigator.serviceWorker.register(root_path + "/service-worker.js", {scope: root_path + "/"}).then(e => {
            if (a) {
                "string" == typeof a && (a = [a]);
                let e = window.setInterval(() => {
                    navigator.serviceWorker.controller && (window.clearInterval(e), navigator.serviceWorker.controller.postMessage({
                        type: "download",
                        content: ["root", "common", "trip-card"].concat(a)
                    }))
                }, 300)
            }
            t()
        }).catch(e => {
            r()
        }) : r()
    })
}

function navigateHome() {
    window.location.href = root_path + "/getpass/index.html"
}

function navigateToTripCard() {
    window.location.href = root_path + "/getpass/trip-card/index.html"
}