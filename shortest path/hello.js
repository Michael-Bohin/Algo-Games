"use strict";
let cities = {
    Reykjavik: [67, 135],
    Dublin: [381, 356],
    London: [516, 391],
    Amsterdam: [602, 371],
    Oslo: [721, 230],
    Copenhagen: [753, 312],
    Berlin: [761, 368],
    Stockholm: [871, 238],
    Warszaw: [927, 377],
    Helsinki: [1007, 218],
    Riga: [999, 236],
    Moscow: [1259, 308],
    Kiev: [1115, 415],
    Budapest: [884, 477],
    Prague: [793, 426],
    Zurich: [683, 470],
    Lisbon: [320, 650],
    Rabat: [367, 746],
    Madrid: [423, 607],
    Algiers: [576, 685],
    Tunis: [716, 684],
    Tripoli: [765, 765],
    Rome: [753, 587],
    Paris: [548, 447],
    Bucharest: [1049, 542],
    Sofia: [1019, 581],
    Istanbul: [1091, 600],
    Athens: [984, 668],
    Beirut: [1216, 748],
    Damascus: [1241, 755]
};
let cities_list = [
    'Reykjavik',
    'Dublin',
    'London',
    'Amsterdam',
    'Oslo',
    'Copenhagen',
    'Berlin',
    'Stockholm',
    'Warszaw',
    'Helsinki',
    'Riga',
    'Moscow',
    'Kiev',
    'Budapest',
    'Prague',
    'Zurich',
    'Lisbon',
    'Rabat',
    'Madrid',
    'Algiers',
    'Tunis',
    'Tripoli',
    'Rome',
    'Paris',
    'Bucharest',
    'Sofia',
    'Istanbul',
    'Athens',
    'Beirut',
    'Damascus'
];
// thirty cities, choose randomly any of the possible beginning and goal and than add 3 + 6 + 12 = 21 cities. Meaning 7 random cities will not be used.
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rand_permutation(list, start, goal) {
    for (var i = 0; i < list.length; i++) {
        let choose = randint(i, list.length - 1);
        var temp = list[i];
        list[i] = list[choose];
        list[choose] = temp;
        if (list[i] == start) {
            // swap found start to index 0
            var temp = list[i];
            list[i] = list[0];
            list[0] = temp;
        }
        if (list[i] == goal) {
            // swap found goal to index 1
            var temp = list[i];
            list[i] = list[1];
            list[1] = temp;
        }
    }
    return list;
}
let perm_cities = ['hi', 'bye']; // initialising permutated cities list outside of onLoad function, in order to be able to acess it from other function too
let img = document.querySelector('img');
let canvas = document.querySelector('canvas');
canvas.width = img.width;
canvas.height = img.height;
let stupid_system = document.querySelectorAll("canvas");
let layer3 = stupid_system[1];
layer3.width = img.width;
layer3.height = img.height;
let cx = canvas.getContext('2d');
let cx2 = layer3.getContext('2d');
let edges = [['hi', 'bye']];
let start = '';
let goal = '';
let step = 1; // main indicator for flight control panel, moreover check result only lets you further if step == 4
function add(i) {
    if (step == 4 || (step != 1 && i == 3)) {
        // do nothing 
    }
    else {
        // 1. record current add into path 
        // 2. modify names of cities in add button 
        // 3. modify remove city in add button 
        // 4. add +1 to step
        // 1:
        let adding = document.getElementById(`btn_add${i}`).innerHTML;
        let modifying = document.getElementById(`path${step + 1}`);
        modifying.innerHTML = adding;
        modifying = document.getElementById('btn_remove');
        modifying.innerHTML = adding;
        // 2:
        if (step == 1) {
            // special case: make third button be without inner text to show that it doesnt do anything 
            modifying.className = "";
            modifying = document.getElementById('btn_add3');
            modifying.innerHTML = "";
            modifying.style.opacity = "0";
        }
        if (step == 3) {
            modifying = document.getElementById('btn_add2');
            modifying.style.opacity = "0";
            modifying = document.getElementById('btn_add1');
            modifying.style.opacity = "0.4";
        }
        // scan all edges for from and for both cases were it is equal to adding save their values
        let city1 = "";
        let city2 = "";
        edges.forEach(function (item) {
            let from = item[0];
            let to = item[1];
            if (from == adding) {
                // found edge from the city, save to 
                if (city1 == "") {
                    city1 = to;
                }
                else {
                    city2 = to;
                }
            }
        });
        modifying = document.getElementById('btn_add2');
        modifying.innerHTML = city2;
        modifying = document.getElementById('btn_add1');
        modifying.innerHTML = city1;
        // 3:
        // 4:
        step += 1;
    }
}
function remove_last() {
    if (step == 1) {
        // do nothing 
    }
    else {
        if (step == 4) {
            // opacity of add 1 and 2 set to 1
            // text in remove goes to its pred -> text of path3
            // text in path1 changes back to: "?"
            // text in add1 and 2 becomes the same as if we just added curent text in remove 
            let modifying = document.getElementById('btn_add2');
            modifying.style.opacity = "1";
            modifying = document.getElementById('btn_add1');
            modifying.style.opacity = "1";
            modifying = document.getElementById("path3");
            let pred = modifying.innerHTML;
            modifying = document.getElementById("btn_remove");
            modifying.innerHTML = pred;
            modifying = document.getElementById("path4");
            modifying.innerHTML = "?";
            let add1 = "";
            let add2 = "";
            edges.forEach(function (edge) {
                let from = edge[0];
                let to = edge[1];
                if (from == pred) {
                    if (add1 == "") {
                        add1 = to;
                    }
                    else {
                        add2 = to;
                    }
                }
            });
            modifying = document.getElementById("btn_add1");
            modifying.innerHTML = add1;
            modifying = document.getElementById("btn_add2");
            modifying.innerHTML = add2;
        }
        if (step == 3) {
            // just modify the text fields
            // 1. let btn_remove be its pred => let btn_remove inner HTML be path 2 inner HTML 
            // 2. let btn_add be the cities where you can fly to from pred 
            // 3. let path3.innnerHTML be "?"
            // 1. :
            let modify = document.getElementById("btn_remove");
            let pred = document.getElementById("path2").innerHTML;
            modify.innerHTML = pred;
            // 2. :
            let add1 = "";
            let add2 = "";
            edges.forEach(function (edge) {
                let from = edge[0];
                let to = edge[1];
                if (from == pred) {
                    if (add1 == "") {
                        add1 = to;
                    }
                    else {
                        add2 = to;
                    }
                }
            });
            modify = document.getElementById("btn_add1");
            modify.innerHTML = add1;
            modify = document.getElementById("btn_add2");
            modify.innerHTML = add2;
            // 3. :
            modify = document.getElementById("path3");
            modify.innerHTML = "?";
        }
        if (step == 2) {
            // 1. : let btn remove be path1
            // 2. : let class of btn remove be disabled 
            // 3. : let btn_add3 opacity be 1
            // 4. : same as 2 in step 2 but with the ability to add 3 cities 
            // 5. : let path 2 be "?"
            let modify = document.getElementById("btn_remove");
            modify.className = "disabled";
            let pred = document.getElementById("path1").innerHTML;
            modify.innerHTML = pred;
            let add1 = "";
            let add2 = "";
            let add3 = "";
            edges.forEach(function (edge) {
                let from = edge[0];
                let to = edge[1];
                if (from == pred) {
                    if (add1 == "") {
                        add1 = to;
                    }
                    else if (add2 == "") {
                        add2 = to;
                    }
                    else {
                        add3 = to;
                    }
                }
            });
            modify = document.getElementById("btn_add1");
            modify.innerHTML = add1;
            modify = document.getElementById("btn_add2");
            modify.innerHTML = add2;
            modify = document.getElementById("btn_add3");
            modify.innerHTML = add3;
            modify.style.opacity = "1";
            modify = document.getElementById("path2");
            modify.innerHTML = "?";
        }
        step -= 1;
    }
}
function check() {
    if (step != 4) {
        // do nothing 
    }
    else {
        // 1. save relevant info: start, first, second, third and goal city. all paths with distances:
        // 2. make body opacity transition to 0 and redirect to next page 
        let first_city = document.getElementById('path2').innerHTML;
        let second_city = document.getElementById('path3').innerHTML;
        let third_city = document.getElementById('path4').innerHTML;
        sessionStorage.setItem("first_city", first_city);
        sessionStorage.setItem("second_city", second_city);
        sessionStorage.setItem("third_city", third_city);
        // all paths:
        for (let i = 1; i < 13; i++) {
            let path_i = "";
            /*
            let first_edge: number = 0;
            let second_edge: number = 0;
            let third_edge: number = 0;
            let fourth_edge: number = 0;*/
            let edges_temp;
            if (i == 1) {
                edges_temp = [edges[2], edges[8], edges[20], edges[32]];
            }
            else if (i == 2) {
                edges_temp = [edges[2], edges[8], edges[19], edges[31]];
            }
            else if (i == 3) {
                edges_temp = [edges[2], edges[7], edges[18], edges[30]];
            }
            else if (i == 4) {
                edges_temp = [edges[2], edges[7], edges[17], edges[29]];
            }
            else if (i == 5) {
                edges_temp = [edges[1], edges[6], edges[16], edges[28]];
            }
            else if (i == 6) {
                edges_temp = [edges[1], edges[6], edges[15], edges[27]];
            }
            else if (i == 7) {
                edges_temp = [edges[1], edges[5], edges[14], edges[26]];
            }
            else if (i == 8) {
                edges_temp = [edges[1], edges[5], edges[13], edges[25]];
            }
            else if (i == 9) {
                edges_temp = [edges[0], edges[4], edges[12], edges[24]];
            }
            else if (i == 10) {
                edges_temp = [edges[0], edges[4], edges[11], edges[23]];
            }
            else if (i == 11) {
                edges_temp = [edges[0], edges[3], edges[10], edges[22]];
            }
            else if (i == 12) {
                edges_temp = [edges[0], edges[3], edges[9], edges[21]];
            }
            path_i = edges_temp[0][0] + " " + edges_temp[1][0] + " " + edges_temp[2][0] + " " + edges_temp[3][0] + " " + edges_temp[3][1];
            sessionStorage.setItem(`path${i}`, path_i);
            let calculation = "";
            let result = 0;
            for (let j = 0; j < 4; j++) {
                let from = edges_temp[j][0];
                let to = edges_temp[j][1];
                let [fx, fy] = cities[from], [tx, ty] = cities[to];
                let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
                dist = Math.round(dist / 10);
                result += dist;
                calculation = calculation + " " + `${dist}`;
            }
            sessionStorage.setItem(`res${i}`, `${result}`);
            sessionStorage.setItem(`calculation${i}`, calculation);
        }
        // make body transition 1s, opacity 0 and timestop 1s for redirect 
        let body = document.querySelector("body");
        body.style.opacity = '0';
        setTimeout(function () { window.location.href = "./game over/congratulations.html"; }, 2000);
    }
}
function onLoad() {
    let body = document.querySelector("body");
    body.style.opacity = '1';
    start = sessionStorage.getItem('start');
    goal = sessionStorage.getItem('goal');
    let paths = sessionStorage.getItem('paths');
    let edge_type = sessionStorage.getItem('edge_type');
    console.log(start);
    console.log(goal);
    console.log(paths);
    console.log(edge_type);
    // modify text1
    let msg_el = document.getElementById('text1');
    msg_el.innerHTML = `Find the cheapest flight from ${start} to ${goal}! 🙏🤔👏`;
    perm_cities = rand_permutation(cities_list, start, goal);
    edges = [
        // step 1, edges from start to first cities
        [perm_cities[0], perm_cities[2]], [perm_cities[0], perm_cities[3]], [perm_cities[0], perm_cities[4]],
        // step 2, edges from first cities to second cities
        [perm_cities[2], perm_cities[5]], [perm_cities[2], perm_cities[6]],
        [perm_cities[3], perm_cities[7]], [perm_cities[3], perm_cities[8]],
        [perm_cities[4], perm_cities[9]], [perm_cities[4], perm_cities[10]],
        //step 3, edge from second cities to third cities 
        [perm_cities[5], perm_cities[11]], [perm_cities[5], perm_cities[12]],
        [perm_cities[6], perm_cities[13]], [perm_cities[6], perm_cities[14]],
        [perm_cities[7], perm_cities[15]], [perm_cities[7], perm_cities[16]],
        [perm_cities[8], perm_cities[17]], [perm_cities[8], perm_cities[18]],
        [perm_cities[9], perm_cities[19]], [perm_cities[9], perm_cities[20]],
        [perm_cities[10], perm_cities[21]], [perm_cities[10], perm_cities[22]],
        // step 4, edge from third cities to goal 
        [perm_cities[11], perm_cities[1]],
        [perm_cities[12], perm_cities[1]],
        [perm_cities[13], perm_cities[1]],
        [perm_cities[14], perm_cities[1]],
        [perm_cities[15], perm_cities[1]],
        [perm_cities[16], perm_cities[1]],
        [perm_cities[17], perm_cities[1]],
        [perm_cities[18], perm_cities[1]],
        [perm_cities[19], perm_cities[1]],
        [perm_cities[20], perm_cities[1]],
        [perm_cities[21], perm_cities[1]],
        [perm_cities[22], perm_cities[1]],
    ];
    let msg = document.getElementById('path1');
    msg.innerHTML = `${perm_cities[0]}`;
    msg = document.getElementById('path2');
    msg.innerHTML = `?`;
    msg = document.getElementById('path3');
    msg.innerHTML = `?`;
    msg = document.getElementById('path4');
    msg.innerHTML = `?`;
    msg = document.getElementById('path5');
    msg.innerHTML = `${perm_cities[1]}`;
    msg = document.getElementById('path5');
    msg.innerHTML = `${perm_cities[1]}`;
    msg = document.getElementById('js1');
    msg.innerHTML = `Through ${perm_cities[2]} and`;
    msg = document.getElementById('js2');
    msg.innerHTML = `${perm_cities[11]}`;
    msg = document.getElementById('js3');
    msg.innerHTML = `${perm_cities[12]}`;
    msg = document.getElementById('js4');
    msg.innerHTML = `${perm_cities[13]}`;
    msg = document.getElementById('js5');
    msg.innerHTML = `${perm_cities[14]}`;
    msg = document.getElementById('js6');
    msg.innerHTML = `Through ${perm_cities[3]} and`;
    msg = document.getElementById('js7');
    msg.innerHTML = `${perm_cities[15]}`;
    msg = document.getElementById('js8');
    msg.innerHTML = `${perm_cities[16]}`;
    msg = document.getElementById('js9');
    msg.innerHTML = `${perm_cities[17]}`;
    msg = document.getElementById('js10');
    msg.innerHTML = `${perm_cities[18]}`;
    msg = document.getElementById('js11');
    msg.innerHTML = `Through ${perm_cities[4]} and`;
    msg = document.getElementById('js12');
    msg.innerHTML = `${perm_cities[19]}`;
    msg = document.getElementById('js13');
    msg.innerHTML = `${perm_cities[20]}`;
    msg = document.getElementById('js14');
    msg.innerHTML = `${perm_cities[21]}`;
    msg = document.getElementById('js15');
    msg.innerHTML = `${perm_cities[22]}`;
    msg = document.getElementById('btn_add1');
    msg.innerHTML = `${perm_cities[2]}`;
    msg = document.getElementById('btn_add2');
    msg.innerHTML = `${perm_cities[3]}`;
    msg = document.getElementById('btn_add3');
    msg.innerHTML = `${perm_cities[4]}`;
    msg = document.getElementById('d1');
    msg.innerHTML = `${perm_cities[2]}`;
    msg = document.getElementById('d2');
    msg.innerHTML = `${perm_cities[3]}`;
    msg = document.getElementById('d3');
    msg.innerHTML = `${perm_cities[4]}`;
    msg = document.getElementById('btn_remove');
    msg.innerHTML = `${perm_cities[0]}`;
    cx.strokeStyle = '#0f0';
    cx.fillStyle = '#0f0';
    cx.font = 'bold 24px sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    for (let [from, to] of edges) {
        cx.beginPath();
        let [fx, fy] = cities[from], [tx, ty] = cities[to];
        cx.lineWidth = 4;
        cx.moveTo(fx, fy);
        cx.lineTo(tx, ty);
        cx.stroke();
        let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
        dist = Math.round(dist / 10);
        let [mid_x, mid_y] = [(fx + tx) / 2, (fy + ty) / 2];
        cx.beginPath();
        cx.arc(mid_x, mid_y, 22, 0, 2 * Math.PI);
        cx.fillStyle = '#fff';
        cx.fill();
        cx.fillStyle = '#0f0';
        cx.strokeStyle = '#0f0';
        cx.fillText(dist.toString(), mid_x, mid_y);
        cx.lineWidth = 1;
        cx.strokeText(dist.toString(), mid_x, mid_y);
    }
    let [fx, fy] = cities[start], [tx, ty] = cities[goal];
    cx.beginPath();
    cx.lineWidth = 4;
    cx.strokeStyle = '#e84a5f';
    cx.fillStyle = '#e84a5f';
    cx.moveTo(fx, fy);
    cx.lineTo(tx, ty);
    cx.stroke();
    cx2.beginPath();
    cx2.fillStyle = '#54430f';
    cx2.strokeStyle = '#54430f';
    cx2.lineWidth = 1;
    cx2.font = 'bold 20px sans-serif';
    cx2.textAlign = 'left';
    cx2.textBaseline = 'middle';
    // start
    cx2.fillText(perm_cities[0], 579, 741);
    // first cities
    cx2.fillText(perm_cities[2], 198, 696);
    cx2.fillText(perm_cities[3], 585, 646);
    cx2.fillText(perm_cities[4], 1008, 696);
    // second citites
    cx2.fillText(perm_cities[5], 53, 569);
    cx2.fillText(perm_cities[6], 282, 566);
    cx2.fillText(perm_cities[7], 447, 408);
    cx2.fillText(perm_cities[8], 730, 422);
    cx2.fillText(perm_cities[9], 919, 566);
    cx2.fillText(perm_cities[10], 1125, 567);
    //third cities 
    cx2.fillText(perm_cities[11], 21, 282);
    cx2.fillText(perm_cities[12], 53, 228);
    cx2.fillText(perm_cities[13], 129, 180);
    cx2.fillText(perm_cities[14], 207, 127);
    cx2.fillText(perm_cities[15], 284, 77);
    cx2.fillText(perm_cities[16], 367, 33);
    cx2.fillText(perm_cities[17], 794, 39);
    cx2.fillText(perm_cities[18], 895, 86);
    cx2.fillText(perm_cities[19], 960, 133);
    cx2.fillText(perm_cities[20], 1038, 183);
    cx2.fillText(perm_cities[21], 1120, 229);
    cx2.fillText(perm_cities[22], 1150, 281);
}
function hide_all() {
    cx.clearRect(0, 0, canvas.width, canvas.height);
}
function display_all() {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.strokeStyle = '#0f0';
    cx.fillStyle = '#0f0';
    cx.font = 'bold 24px sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    for (let [from, to] of edges) {
        cx.beginPath();
        let [fx, fy] = cities[from], [tx, ty] = cities[to];
        cx.lineWidth = 4;
        cx.moveTo(fx, fy);
        cx.lineTo(tx, ty);
        cx.stroke();
        let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
        dist = Math.round(dist / 10);
        let [mid_x, mid_y] = [(fx + tx) / 2, (fy + ty) / 2];
        cx.beginPath();
        cx.arc(mid_x, mid_y, 22, 0, 2 * Math.PI);
        cx.fillStyle = '#fff';
        cx.fill();
        cx.fillStyle = '#0f0';
        cx.strokeStyle = '#0f0';
        cx.fillText(dist.toString(), mid_x, mid_y);
        cx.lineWidth = 1;
        cx.strokeText(dist.toString(), mid_x, mid_y);
    }
    let [fx, fy] = cities[start], [tx, ty] = cities[goal];
    cx.beginPath();
    cx.lineWidth = 4;
    cx.strokeStyle = '#e84a5f';
    cx.fillStyle = '#e84a5f';
    cx.moveTo(fx, fy);
    cx.lineTo(tx, ty);
    cx.stroke();
}
function visualise(i) {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.strokeStyle = '#0f0';
    cx.fillStyle = '#0f0';
    cx.font = 'bold 24px sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    let edges1;
    if (i == 1) {
        // edges: 0, 3, 4, 9, 10, 11, 12, 21, 22, 23, 24
        edges1 = [edges[0], edges[3], edges[4], edges[9], edges[10], edges[11], edges[12], edges[21], edges[22], edges[23], edges[24]];
    }
    else if (i == 2) {
        // edges: 1, 5, 6, 13, 14, 15, 16, 25, 26, 27, 28
        edges1 = [edges[1], edges[5], edges[6], edges[13], edges[14], edges[15], edges[16], edges[25], edges[26], edges[27], edges[28]];
    }
    else if (i == 3) {
        // edges: 2, 7, 8, 17, 18, 19, 20, 29, 30, 31, 32 
        edges1 = [edges[2], edges[7], edges[8], edges[17], edges[18], edges[19], edges[20], edges[29], edges[30], edges[31], edges[32]];
    }
    else if (i == 22) {
        edges1 = [edges[2], edges[8], edges[20], edges[32]];
    }
    else if (i == 21) {
        edges1 = [edges[2], edges[8], edges[19], edges[31]];
    }
    else if (i == 20) {
        edges1 = [edges[2], edges[7], edges[18], edges[30]];
    }
    else if (i == 19) {
        edges1 = [edges[2], edges[7], edges[17], edges[29]];
    }
    else if (i == 18) {
        edges1 = [edges[1], edges[6], edges[16], edges[28]];
    }
    else if (i == 17) {
        edges1 = [edges[1], edges[6], edges[15], edges[27]];
    }
    else if (i == 16) {
        edges1 = [edges[1], edges[5], edges[14], edges[26]];
    }
    else if (i == 15) {
        edges1 = [edges[1], edges[5], edges[13], edges[25]];
    }
    else if (i == 14) {
        edges1 = [edges[0], edges[4], edges[12], edges[24]];
    }
    else if (i == 13) {
        edges1 = [edges[0], edges[4], edges[11], edges[23]];
    }
    else if (i == 12) {
        edges1 = [edges[0], edges[3], edges[10], edges[22]];
    }
    else if (i == 11) {
        edges1 = [edges[0], edges[3], edges[9], edges[21]];
    }
    for (let [from, to] of edges1) {
        cx.beginPath();
        let [fx, fy] = cities[from], [tx, ty] = cities[to];
        cx.lineWidth = 4;
        cx.moveTo(fx, fy);
        cx.lineTo(tx, ty);
        cx.stroke();
        let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
        dist = Math.round(dist / 10);
        let [mid_x, mid_y] = [(fx + tx) / 2, (fy + ty) / 2];
        cx.beginPath();
        cx.arc(mid_x, mid_y, 22, 0, 2 * Math.PI);
        cx.fillStyle = '#fff';
        cx.fill();
        cx.fillStyle = '#0f0';
        cx.strokeStyle = '#0f0';
        cx.fillText(dist.toString(), mid_x, mid_y);
        cx.lineWidth = 1;
        cx.strokeText(dist.toString(), mid_x, mid_y);
    }
    let [fx, fy] = cities[start], [tx, ty] = cities[goal];
    cx.beginPath();
    cx.lineWidth = 4;
    cx.strokeStyle = '#e84a5f';
    cx.fillStyle = '#e84a5f';
    cx.moveTo(fx, fy);
    cx.lineTo(tx, ty);
    cx.stroke();
}
function tree() {
    let modify = document.getElementById('layer2');
    modify.style.opacity = '1';
    modify = document.getElementById('layer3');
    modify.style.opacity = '1';
}
function satelite() {
    let modify = document.getElementById('layer2');
    modify.style.opacity = '0';
    modify = document.getElementById('layer3');
    modify.style.opacity = '0';
}
window.addEventListener('load', onLoad);
