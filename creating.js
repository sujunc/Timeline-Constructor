document.getElementById('name').addEventListener('keydown', function(e) {
    updateTitle();
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
var systems = [];
var events = [];
var characters = [];

function toggleNav() {
    if (document.getElementById("events").style.width == "0px") {
        openNav();
    } else {
        closeNav();
    }
}

function openNav() {
    document.getElementById("events").style.width = "25%";
    document.getElementById("timeline").style.marginLeft = "25%";
    var overlay = document.getElementsByClassName("overlay");
    for (i = 0; i < overlay.length; i++) {
        overlay[i].style.marginLeft = "25%";
        overlay[i].style.width = "75%";
        overlay[i].getElementsByClassName("openbtn")[0].innerHTML = "&#171;"
    }
}

function closeNav() {
    document.getElementById("events").style.width = "0px";
    document.getElementById("timeline").style.marginLeft = "0px";
    var overlay = document.getElementsByClassName("overlay");
    for (i = 0; i < overlay.length; i++) {
        overlay[i].style.marginLeft = "0px";
        overlay[i].style.width = "100%";
        overlay[i].getElementsByClassName("openbtn")[0].innerHTML = "&#187;"
    }
}

class SysEntry {
    constructor(sysname, year, month, week, day, mpy, wpm, dpw, dpm) {
        this.sysname = sysname;
        this.year = year;
        this.month = month;
        this.week = week;
        this.day = day;
        this.mpy = mpy;
        this.wpm = wpm;
        this.dpw = dpw;
        this.dpm = dpm;
        this.system;
        this.editing = false;
    }
}

class EventEntry {
    constructor(eventname, description, system, sy, sm, sd, ey, em, ed) {
        this.eventname = eventname;
        this.description = description
        this.system = system;
        this.startyear = sy;
        this.startmonth = sm;
        this.startday = sd;
        this.endyear = ey;
        this.endmonth = em;
        this.endday = ed;
        this.editing = false;
    }
}

class CharEntry {
    constructor(name, birthyear, birthmonth, birthday, deathyear, deathmonth, deathday) {
        this.name = name;
        this.birthyear = birthyear;
        this.birthmonth = birthmonth;
        this.birthday = birthday;
        this.deathyear = deathyear;
        this.deathmonth = deathmonth;
        this.deathday = deathday;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
    }
    addNode(name) {
        var node = new Node(name);
        var i = 0;
        for (i = 0; i < this.nodes.length; i++) {
            var entry = findSys(name);
            var thing = new Relation(entry.sysname);
            this.nodes[i].relations.push(thing);
        }
        this.nodes.push(node);
    }
    searchNode(name) {
        var i = 0;
        for (i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].name == name) {
                return this.nodes[i];
            }
        }
        return false;
    }
    renameNode(oldname, name) {
        var namenode = this.searchNode(oldname);
        namenode.name = name;
        var i = 0;
        for (i = 0; i < this.nodes.length; i++) {
            this.nodes[i].renameRelations(oldname, name);
        }
    }
}

class Node {
    constructor(name) {
        this.name = name;
        this.loadrelations = function() {
            var relations = [];
            var entry = findSys(name);
            var i = 0;
            for (i = 0; i < systems.length; i++) {
                if (entry.sysname != systems[i].sysname) {
                    relations.push(entry, new Relation(systems[i].sysname));
                }
            }
            return relations;
        };
        this.relations = this.loadrelations();
    }
    renameRelations(oldname, name) {
        var i = 0;
        for (i = 0; i < this.relations.length; i++) {
            if (this.relations[i].connector == oldname) {
                this.relations[i].connector = name;
            }
        }
    }
    searchRelations(name) {
        var i = 0;
        for (i = 0; i < this.relations.length; i++) {
            if (this.relations[i].connector == name) {
                return this.relations[i];
            }
        }
        return false;
    }
}
class Relation {
    constructor(connector) {
        this.connector = connector;
        this.empty = true;
        this.defined = false;
        this.ryear = [0, 0];
        this.rmonth = [0, 0];
        this.rweek = [0, 0];
        this.rday = [0, 0];
        this.eyear = [0, 0];
        this.emonth = [0, 0];
        this.eday = [0, 0];
    }
}

var systemgraph = new Graph();

function openSys() {
    closeSys();
    document.getElementById("sysform").reset();
    document.getElementById("system").style.marginTop = "190px";
    closeChara();
    closeEvent();
}

function closeSys() {
    document.getElementById("system").style.marginTop = "100%";
    document.getElementById("systemselect").innerHTML = "";
    document.getElementById("syswarning").innerHTML = "";
    for (i = 0; i < systems.length; i++) {
        systems[i].editing = false;
    }
}

function openChara() {
    closeChara();
    document.getElementById("charform").reset();
    document.getElementById("char").style.marginTop = "190px";
    closeSys();
    closeEvent();
}

function closeChara() {
    document.getElementById("char").style.marginTop = "100%";
    document.getElementById("charwarning").innerHTML = "";
    for (i = 0; i < characters.length; i++) {
        characters[i].editing = false;
    }

}

function openEvent() {
    closeEvent();
    document.getElementById("eventform").reset();
    document.getElementById("event").style.marginTop = "190px";
    closeSys();
    closeChara();
}

function closeEvent() {
    document.getElementById("event").style.marginTop = "100%";
    document.getElementById("eventwarning").innerHTML = "";
    for (i = 0; i < events.length; i++) {
        events[i].editing = false;
    }

}


function updateTitle() {
    var head = document.getElementById("name").innerHTML;
    document.title = head;
}

function updatePlaceholders() {
    var year = document.getElementById("year").value;
    var month = document.getElementById("month").value;
    var week = document.getElementById("week").value;
    var day = document.getElementById("day").value;
    document.getElementById("mpy").placeholder = month + "s per " + year;
    document.getElementById("wpm").placeholder = week + "s per " + month;
    document.getElementById("dpw").placeholder = day + "s per " + week;
    document.getElementById("dpm").placeholder = day + "s per " + month;
    document.getElementById("Ayear").placeholder = year;
    document.getElementById("Amonth").placeholder = month;
    document.getElementById("Aweek").placeholder = week;
    document.getElementById("Aday").placeholder = day;
    document.getElementById("Ayy").placeholder = year;
    document.getElementById("Amm").placeholder = month;
    document.getElementById("Add").placeholder = day;
}

function findSys(name, skip = "") {
    if (skip != "") {
        j = 0;
        for (i = 0; i < systems.length; i++) {
            if (systems[i].sysname == name && j > 0) { return systems[i]; }
            if (systems[i].sysname == name) j += 1;
        }
        return false;
    }
    for (i = 0; i < systems.length; i++) {
        if (systems[i].sysname == name) { return systems[i]; }
    }
    return false;
}

function findEditing(list) {
    for (i = 0; i < list.length; i++) {
        if (list[i].editing) { return list[i]; }
    }
    return false;
}

function findButton(list, name) {
    for (i = 0; i < list.length; i++) {
        if (list[i].innerHTML == name) {
            return list[i];
        }
    }
    return false;
}

function updateSystem() {
    var name = document.getElementById("sysname").value;
    if (name.length == 0) {
        document.getElementById("syswarning").innerHTML = "Please put in a name!";
    } else if (findEditing(systems) && (!findSys(name) || (findSys(name).editing))) {
        var thing = findEditing(systems);
        var btn = findButton(document.getElementsByClassName("sysitem"), thing.sysname);
        var btn2 = findButton(document.getElementsByClassName("sysmenuitem"), thing.sysname);
        var btn3 = findButton(document.getElementsByClassName("eventsysmenuitem"), thing.sysname);
        var btn4 = findButton(document.getElementsByClassName("charsysmenuitem"), thing.sysname);
        thing.year = document.getElementById("year").value;
        thing.month = document.getElementById("month").value;
        thing.week = document.getElementById("week").value;
        thing.day = document.getElementById("day").value;
        thing.mpy = document.getElementById("mpy").value;
        thing.wpm = document.getElementById("wpm").value;
        thing.dpw = document.getElementById("dpw").value;
        thing.dpm = document.getElementById("dpm").value;
        if (thing.sysname != name) {
            systemgraph.renameNode(thing.sysname, name);
        }
        if (thing.system != undefined) {
            var node1 = systemgraph.searchNode(thing.sysname);
            var node2 = systemgraph.searchNode(thing.system);
            console.log("node2");
            console.log(node2);
            var relation1 = node1.searchRelations(thing.system);
            var relation2 = node2.searchRelations(thing.sysname);
            console.log(relation2);
            if (document.getElementById("Ayear").value != "") {
                relation1.ryear[0] = document.getElementById("Ayear").value;
                relation2.ryear[0] = document.getElementById("Byear").value;
            }
            if (document.getElementById("Byear").value != "") {
                relation1.ryear[1] = document.getElementById("Byear").value;
                relation2.ryear[1] = document.getElementById("Ayear").value;
            }
            if (document.getElementById("Amonth").value != "") {
                relation1.rmonth[0] = document.getElementById("Amonth").value;
                relation2.rmonth[0] = document.getElementById("Bmonth").value;
            }
            if (document.getElementById("Bmonth").value != "") {
                relation1.rmonth[1] = document.getElementById("Bmonth").value;
                relation2.rmonth[1] = document.getElementById("Amonth").value;
            }
            if (document.getElementById("Aweek").value != "") {
                relation1.rweek[0] = document.getElementById("Aweek").value;
                relation2.rweek[0] = document.getElementById("Bweek").value;
            }
            if (document.getElementById("Bweek").value != "") {
                relation1.rweek[1] = document.getElementById("Bweek").value;
                relation2.rweek[1] = document.getElementById("Aweek").value;
            }
            if (document.getElementById("Aday").value != "") {
                relation1.rday[0] = document.getElementById("Aday").value;
                relation2.rday[0] = document.getElementById("Bday").value;
            }
            if (document.getElementById("Bday").value != "") {
                relation1.rday[1] = document.getElementById("Bday").value;
                relation2.rday[1] = document.getElementById("Aday").value;
            }
            if (document.getElementById("Ayy").value != "") {
                relation1.eyear[0] = document.getElementById("Ayy").value;
                relation2.eyear[0] = document.getElementById("Byy").value;
            }
            if (document.getElementById("Byy").value != "") {
                relation1.eyear[1] = document.getElementById("Byy").value;
                relation2.eyear[1] = document.getElementById("Ayy").value;
            }
            if (document.getElementById("Amm").value != "") {
                relation1.emonth[0] = document.getElementById("Am").value;
                relation2.emonth[0] = document.getElementById("Bmm").value;
            }
            if (document.getElementById("Bmm").value != "") {
                relation1.emonth[1] = document.getElementById("Bmm").value;
                relation2.emonth[1] = document.getElementById("Am").value;
            }
            if (document.getElementById("Add").value != "") {
                relation1.eday[0] = document.getElementById("Add").value;
                relation2.eday[0] = document.getElementById("Bdd").value;
            }
            if (document.getElementById("Bdd").value != "") {
                relation1.eday[1] = document.getElementById("Bdd").value;
                relation2.eday[1] = document.getElementById("Add").value;
            }
        }
        thing.sysname = name;
        btn.innerHTML = name;
        btn2.innerHTML = name;
        btn3.innerHTML = name;
        btn4.innerHTML = name;
        thing.system = undefined;
        document.getElementById("sysform").reset();
        closeSys();
    } else if (!findSys(name)) {
        document.getElementById("sys").innerHTML = "";
        document.getElementById("syswarning").innerHTML = "";
        addSys(name);
        var year = document.getElementById("year").value;
        var month = document.getElementById("month").value;
        var week = document.getElementById("week").value;
        var day = document.getElementById("day").value;
        var mpy = document.getElementById("mpy").value;
        var wpm = document.getElementById("wpm").value;
        var dpw = document.getElementById("dpw").value;
        var dpm = document.getElementById("dpm").value;
        systems.push(new SysEntry(name, year, month, week, day, mpy, wpm, dpw, dpm));
        document.getElementById("sysform").reset();
        systemgraph.addNode(name);
        console.log(systemgraph);
        closeSys();
    } else {
        document.getElementById("syswarning").innerHTML = "Name already exists!";
    }
}

function loadSys(name) {
    openSys();
    for (i = 0; i < systems.length; i++) {
        systems[i].editing = false;
    }
    var btn = findSys(name);
    if (btn.editing) {
        document.getElementById("sysform").reset();
        closeSys();
        btn.editing = false;
    } else {
        document.getElementById("sysname").value = btn.sysname;
        document.getElementById("year").value = btn.year;
        document.getElementById("month").value = btn.month;
        document.getElementById("week").value = btn.week;
        document.getElementById("day").value = btn.day;
        document.getElementById("mpy").value = btn.mpy;
        document.getElementById("wpm").value = btn.wpm;
        document.getElementById("dpw").value = btn.dpw;
        document.getElementById("dpm").value = btn.dpm;
        btn.editing = true;
    }
}

function loadSysHub(sys, name) {
    var node = systemgraph.searchNode(sys.sysname);
    if (!node) {
        document.getElementById("systemselect").innerHTML = "Please save first!";
        return;
    }
    var relation = node.searchRelations(name);
    if (!relation) {
        document.getElementById("systemselect").innerHTML = "Cannot select yourself!";
        return;
    }
    document.getElementById("systemselect").innerHTML = name + " selected";
    var a = relation.ryear[0];
    var b = relation.ryear[1];
    var c = relation.rmonth[0];
    var d = relation.rmonth[1];
    var e = relation.rweek[0];
    var f = relation.rweek[1];
    var g = relation.rday[0];
    var h = relation.rday[1];
    var i = relation.eyear[0];
    var j = relation.eyear[1];
    var k = relation.emonth[0];
    var l = relation.emonth[1];
    var m = relation.eday[0];
    var n = relation.eday[1];
    if (a != 0 || b != 0) {
        document.getElementById("Ayear").value = a;
        document.getElementById("Byear").value = b;
    }
    if (c != 0 || d != 0) {
        document.getElementById("Amonth").value = c;
        document.getElementById("Bmonth").value = d;
    }
    if (e != 0 || f != 0) {
        document.getElementById("Aweek").value = e;
        document.getElementById("Bweek").value = f;
    }
    if (g != 0 || h != 0) {
        document.getElementById("Aday").value = g;
        document.getElementById("Bday").value = h;
    }
    if (i != 0 || j != 0) {
        document.getElementById("Ayy").value = i;
        document.getElementById("Byy").value = j;
    }
    if (k != 0 || l != 0) {
        document.getElementById("Amm").value = k;
        document.getElementById("Bmm").value = l;
    }
    if (m != 0 || n != 0) {
        document.getElementById("Add").value = m;
        document.getElementById("Bdd").value = n;
    }
    return name;

}

function loadEventHub(name) {
    return 42;
}

function loadCharHub(name) {
    return 42;
}

function addSys(name) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = name;
    btn.className = "sysitem";
    btn.style.textAlign = "left";
    btn.style.paddingLeft = "12px";
    btn.style.textOverflow = "ellipsis"
    btn.style.overflow = "hidden";
    btn.onclick = function() {
        loadSys(btn.innerHTML);
    };
    document.getElementById("systemlist").appendChild(btn);
    var btn2 = document.createElement("BUTTON");
    btn2.innerHTML = name;
    btn2.type = "button";
    btn2.className = "sysmenuitem";
    document.getElementById("systemshub").appendChild(btn2);
    btn2.onclick = function() {
        loadSysHub(findEditing(systems), btn2.innerHTML);
        findEditing(systems).system = btn2.innerHTML;
    };
    var btn3 = document.createElement("BUTTON");
    btn3.innerHTML = name;
    btn3.type = "button";
    btn3.className = "eventsysmenuitem";
    btn3.onclick = function() { loadEventHub(btn3.innerHTML); };
    document.getElementById("eventsystemshub").appendChild(btn3);
    var btn4 = document.createElement("BUTTON");
    btn4.innerHTML = name;
    btn4.type = "button";
    btn4.className = "charsysmenuitem";
    btn4.onclick = function() { loadCharHub(btn4.innerHTML); };
    document.getElementById("charsystemshub").appendChild(btn4);
}

function updateChar() {
    var name = document.getElementById("charname").value;
    if (name.length == 0) {
        document.getElementById("charwarning").innerHTML = "Please put in a name!"
    } else if (findEditing(characters) && (!findChar(name) || (findChar(name).editing))) {
        var thing = findEditing(characters);
        var btn = findButton(document.getElementsByClassName("charitem"), thing.name);
        thing.birthyear = document.getElementById("charbyr").value;
        thing.birthmonth = document.getElementById("charbmonth").value;
        thing.birthday = document.getElementById("charbday").value;
        thing.deathyear = document.getElementById("chardyr").value;
        thing.deathmonth = document.getElementById("chardmonth").value;
        thing.deathday = document.getElementById("chardday").value;
        thing.name = name;
        btn.innerHTML = name;
        document.getElementById("charform").reset();
        closeChara();
    } else if (!findChar(name)) {
        document.getElementById("chara").innerHTML = "";
        document.getElementById("charwarning").innerHTML = "";
        addChar(name);
        var by = document.getElementById("charbyr").value;
        var bm = document.getElementById("charbmonth").value;
        var bd = document.getElementById("charbday").value;
        var dy = document.getElementById("chardyr").value;
        var dm = document.getElementById("chardmonth").value;
        var db = document.getElementById("chardday").value;
        characters.push(new CharEntry(name, by, bm, bd, dy, dm, db));
        document.getElementById("charform").reset();
        closeChara();
    } else {
        document.getElementById("charwarning").innerHTML = "Name already exists!";
    }
}

function findChar(name, skip = "") {
    if (skip != "") {
        j = 0;
        for (i = 0; i < characters.length; i++) {
            if (characters[i].name == name && j > 0) { return characters[i]; }
            if (characters[i].name == name) j += 1;
        }
        return false;
    }
    for (i = 0; i < characters.length; i++) {
        if (characters[i].name == name) { return characters[i]; }
    }
    return false;
}

function addChar(name) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = name;
    btn.style.textAlign = "left";
    btn.style.paddingLeft = "12px";
    btn.style.textOverflow = "ellipsis"
    btn.style.overflow = "hidden";
    btn.onclick = function() {
        loadChar(btn.innerHTML);
    }
    btn.className = "charitem";
    document.getElementById("charlist").appendChild(btn);
}

function loadChar(name) {
    openChara();
    for (i = 0; i < characters.length; i++) {
        characters[i].editing = false;
    }
    var btn = findChar(name);
    if (btn.editing) {
        document.getElementById("charform").reset();
        closeChara();
        btn.editing = false;
    } else {
        document.getElementById("charname").value = btn.name;
        document.getElementById("charbyr").value = btn.birthyear;
        document.getElementById("charbmonth").value = btn.birthmonth;
        document.getElementById("charbday").value = btn.birthday;
        document.getElementById("chardyr").value = btn.deathyear;
        document.getElementById("chardmonth").value = btn.deathmonth;
        document.getElementById("chardday").value = btn.deathday;
        btn.editing = true;
    }
}

function updateEvent() {
    var name = document.getElementById("eventname").value
    if (name.length == 0) {
        document.getElementById("eventwarning").innerHTML = "Please put in a name!"
    } else if (findEditing(events) && (!findEvent(name) || (findEvent(name).editing))) {
        var thing = findEditing(events);
        var btn = findButton(document.getElementsByClassName("eventitem"), thing.eventname);
        thing.description = document.getElementById("eventdesc").value;
        thing.system = document.getElementById("eventsystemshub").value;
        thing.startyear = document.getElementById("seventyr").value;
        thing.startmonth = document.getElementById("seventmonth").value;
        thing.startday = document.getElementById("seventday").value;
        thing.endyear = document.getElementById("eeventyr").value;
        thing.endmonth = document.getElementById("eeventmonth").value;
        thing.endday = document.getElementById("eeventday").value;
        thing.editing = false;
        thing.eventname = document.getElementById("eventname").value;
        btn.innerHTML = name;
        console.log(btn.innerHTML);
        document.getElementById("eventform").reset();
        closeEvent();
    } else if (!findEvent(name)) {
        document.getElementById("evts").innerHTML = "";
        document.getElementById("eventwarning").innerHTML = "";
        addEvent(name);
        var desc = document.getElementById("eventdesc").value;
        var sy = document.getElementById("seventyr").value;
        var sm = document.getElementById("seventmonth").value;
        var sd = document.getElementById("seventday").value;
        var ey = document.getElementById("eeventyr").value;
        var em = document.getElementById("eeventmonth").value;
        var ed = document.getElementById("eeventday").value;
        events.push(new EventEntry(name, desc, sy, sm, sd, ey, em, ed));
        document.getElementById("eventform").reset();
        closeEvent();
    } else {
        document.getElementById("eventwarning").innerHTML = "Name already exists!";
    };
}


function findEvent(name, skip = "") {
    if (skip != "") {
        j = 0;
        for (i = 0; i < events.length; i++) {
            if (events[i].eventname == name && j > 0) { return events[i]; }
            if (events[i].eventname == name) j += 1;
        }
        return false;
    }
    for (i = 0; i < events.length; i++) {
        if (events[i].eventname == name) { return events[i]; }
    }
    return false;
}

function loadEvent(name) {
    openEvent();
    for (i = 0; i < events.length; i++) {
        events[i].editing = false;
    }
    var btn = findEvent(name);
    if (btn.editing) {
        document.getElementById("eventform").reset();
        closeEvent();
        btn.editing = false;
    } else {
        document.getElementById("eventname").value = btn.eventname;
        document.getElementById("eventdesc").value = btn.description;
        document.getElementById("seventyr").value = btn.startyear;
        document.getElementById("seventmonth").value = btn.startmonth;
        document.getElementById("seventday").value = btn.startday;
        document.getElementById("eeventyr").value = btn.endyear;
        document.getElementById("eeventmonth").value = btn.endmonth;
        document.getElementById("eeventday").value = btn.endday;
        btn.editing = true;
    }
}

function addEvent(name) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = name;
    btn.style.textAlign = "left";
    btn.style.paddingLeft = "12px";
    btn.style.textOverflow = "ellipsis"
    btn.style.overflow = "hidden";
    btn.className = "eventitem";
    btn.onclick = function() {
        loadEvent(btn.innerHTML);
    };
    document.getElementById("eventlist").appendChild(btn);
}