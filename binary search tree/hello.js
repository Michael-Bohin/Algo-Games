"use strict";
/* >>>>>>>> intended generic class BST, sadly worked out as two BST_i and BST_s <<<<<<<<<<<< */
class Node_i {
    constructor(val) {
        this.val = val;
    }
}
class Node_s {
    constructor(val) {
        this.val = val;
    }
}
class BST_i {
    constructor() {
        this.root = null;
    }
    insert(i) {
        let temp = this.root;
        let previous = null;
        while (temp != null) {
            // search for the Node that we would to insert the value to
            previous = temp;
            if (temp.val > i) {
                // current value of node in tree is greater -> move left 
                temp = temp.left;
            }
            else {
                temp = temp.right;
            }
        }
        // assert case empty tree
        if (previous == null) {
            this.root = new Node_i(i);
        }
        else {
            if (previous.val > i) {
                previous.left = new Node_i(i);
            }
            else {
                previous.right = new Node_i(i);
            }
        }
    }
    // search is similar, except it doesnt insert anything 
    // return true if val of temp == i and once temp is null return false
    // and no need to store previous
    contains(i) {
        let temp = this.root;
        while (temp != null) {
            // search for the Node that we would to insert the value to
            if (temp.val > i) {
                // current value of node in tree is greater -> move left 
                temp = temp.left;
            }
            else if (temp.val < i) {
                temp = temp.right;
            }
            else {
                return true;
            }
        }
        return false;
    }
}
class BST_s {
    constructor() {
        this.root = null;
    }
    insert(i) {
        let temp = this.root;
        let previous = null;
        while (temp != null) {
            // search for the Node that we would to insert the value to
            previous = temp;
            if (temp.val > i) {
                // current value of node in tree is greater -> move left 
                temp = temp.left;
            }
            else {
                temp = temp.right;
            }
        }
        // assert case empty tree
        if (previous == null) {
            this.root = new Node_s(i);
        }
        else {
            if (previous.val > i) {
                previous.left = new Node_s(i);
            }
            else {
                previous.right = new Node_s(i);
            }
        }
    }
    // search is similar, except it doesnt insert anything 
    // return true if val of temp == i and once temp is null return false
    // and no need to store previous
    contains(i) {
        let temp = this.root;
        while (temp != null) {
            // search for the Node that we would to insert the value to
            if (temp.val > i) {
                // current value of node in tree is greater -> move left 
                temp = temp.left;
            }
            else if (temp.val < i) {
                temp = temp.right;
            }
            else {
                return true;
            }
        }
        return false;
    }
}
/* >>>>>>>> page constructor <<<<<<<<<<<< */
let modify = document.querySelector('body');
modify.innerHTML = `
    <div id="hihi">
    <table id="hi">
        <tr>
            <td>
                <p>Choose your elements' universe</p>
            </td>
        </tr>

        <tr>
            <td>
            <button id="integers" onclick="integers()">Numbers 0 - 100</button>
            </td>
            <td>
            <button id="verbs" onclick="verbs()">English verbs</button>
            </td>
        </tr>
    </table>
    </div>
`;
let list_str = [
    "be", "have", "do", "say", "go", "get", "make", "know", "think", "take", "see",
    "come", "want", "look", "use", "find", "give", "tell", "work", "call",
    "try", "ask", "need", "feel", "become", "leave", "put", "mean", "keep", "let",
    "begin", "seem", "help", "talk", "turn", "start", "show", "hear", "play", "run",
    "move", "like", "live", "believe", "hold", "bring", "happen", "write", "provide", "sit",
    "stand", "lose", "pay", "meet", "include", "continue", "set", "learn", "change", "lead",
    "understand", "watch", "follow", "stop", "create", "speak", "read", "allow",
    "add", "spend", "grow", "open", "walk", "win", "offer", "remember", "love", "consider",
    "appear", "buy", "wait", "serve", "die", "send", "expect", "build", "stay", "fall", "cut",
    "reach", "kill", "remain", "suggest", "pass", "sell", "require", "report", "decide", "pull", "focus"
];
let list_int = new Array(101);
for (let i = 0; i < list_int.length; i++) {
    list_int[i] = i;
}
let universe = "";
let x = new BST_i();
let y = new BST_s();
let question_int = -1;
let question_string = "rampam";
var current_iNode;
var current_sNode;
let seen_iArray = new Array(20);
let seen_sArray = new Array(20);
let seen_array_index = 0;
let parent_card_revealed = false;
let seen_cards_count = 0;
let canvas = document.querySelector('canvas');
let cx = canvas.getContext('2d');
cx.beginPath();
var moving_BST_animation_in_progress = false;
/* >>>>>>>> functions <<<<<<<<<<<< */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function random_int_permutation() {
    for (let i = 0; i < list_int.length; i++) {
        let choose = randint(i, list_int.length - 1);
        let temp = list_int[i];
        list_int[i] = list_int[choose];
        list_int[choose] = temp;
    }
    list_int = list_int;
}
function random_string_permutation() {
    for (let i = 0; i < list_str.length; i++) {
        let choose = randint(i, list_str.length - 1);
        let temp = list_str[i];
        list_str[i] = list_str[choose];
        list_str[choose] = temp;
    }
    list_str = list_str;
}
function integers() {
    universe = "int";
    random_int_permutation();
    list_int.forEach(element => {
        console.log(element);
    });
    for (let i = 0; i < list_int.length / 2; i++) { // insert only first half of elements => each has 50% chance of being included
        x.insert(list_int[i]);
    }
    current_iNode = x.root;
    console.log(x.contains(1));
    console.log(x.contains(2));
    console.log(x.contains(3));
    console.log(x.contains(4));
    console.log(x.contains(5));
    console.log(x.contains(6));
    console.log(x.contains(7));
    console.log(x.contains(8));
    console.log(x.root.val);
    console.log(x.root.left.val);
    console.log(x.root.right.val);
    game();
}
function verbs() {
    universe = "string";
    random_string_permutation();
    list_str.forEach(element => {
        console.log(element);
    });
    for (let i = 0; i < list_int.length / 2; i++) { // insert only first half of elements => each has 50% chance of being included
        y.insert(list_str[i]);
    }
    current_sNode = y.root;
    console.log(y.contains("be"));
    console.log(y.contains("have"));
    console.log(y.contains("do"));
    console.log(y.contains("get"));
    console.log(y.contains("run"));
    console.log(y.contains("pay"));
    console.log(y.contains("create"));
    console.log(y.contains("speak"));
    console.log(y.root.val);
    console.log(y.root.left.val);
    console.log(y.root.right.val);
    game();
}
function game() {
    modify.innerHTML = `
        <div id="hihihi"></div>
        <p id="q"></p>   
        <img src="background with seen array.jpg" id="image">
        <canvas id="canvas" ></canvas>    
        <button id="left_child" onclick="left_child()">Go to left child</button>    
        <button id="right_child" onclick="right_child()">Go to right child</button>   
        <button id="turn" onclick="turn()">Turn card face up</button>
        
        <img id="left_face_down" src="cardfacedown.png">
        <img id="right_face_down" src="cardfacedown.png">
        <img id="parent_face_up" src="cardvalueless.png">
        <img id="parent_face_down" src="cardfacedown.png">
        <img id="left_null" src="cardshade.png">
        <img id="right_null" src="cardshade.png">

        <img id="seen0" src="cardvalueless.png">
        <img id="seen1" src="cardvalueless.png">
        <img id="seen2" src="cardvalueless.png">
        <img id="seen3" src="cardvalueless.png">
        <img id="seen4" src="cardvalueless.png">
        <img id="seen5" src="cardvalueless.png">
        <img id="seen6" src="cardvalueless.png">
        <img id="seen7" src="cardvalueless.png">
        <img id="seen8" src="cardvalueless.png">
        <img id="seen9" src="cardvalueless.png">
        
    `;
    let msg = document.getElementById("q");
    if (universe == "int") {
        question_int = randint(0, 100);
        msg.innerHTML = `Does the binary search tree contain number: '${question_int}' ?`;
        current_iNode = x.root;
    }
    else {
        question_string = list_str[randint(0, 99)];
        msg.innerHTML = `Does the binary search tree contain word: '${question_string}' ?`;
        current_sNode = y.root;
    }
    init_draw();
}
function init_draw() {
    // draw names of left child, right child and parent node 
    // three cards at their position face down 
    let canvas = document.querySelector('canvas');
    let cx = canvas.getContext('2d');
    cx.beginPath();
    cx.strokeStyle = '#fff';
    cx.fillStyle = '#fff';
    cx.font = 'bold 8px sans-serif';
    cx.textAlign = 'left';
    cx.textBaseline = 'top';
    cx.lineWidth = 10;
    /*cx.strokeText("left child", 20, 10);
    cx.strokeText("right child", 150, 10);
    cx.strokeText("parent", 100, 50);*/
    cx.fillText("left child", 60, 10);
    cx.fillText("right child", 220, 10);
    cx.fillText("parent", 140, 50);
}
function left_child() {
    console.log("left!");
    // 0.a. clear rectangle area of possible displayed value of card on canvas
    // 0.b. set boolean animation in progress to true and set timeout to set it to false after it is done in 1700 miliseconds 
    // 1. set parent card revelead to false and move current node 
    // 2. for 0.8 second dont display parent card and right child card
    // 3. transition left child for 0.6 seconds to position of parent card
    // 4. after that display all cards at their position: 
    //          a) disaply parent card again 
    //          b) set transition to 0s for left childs card
    //          c) display right child and set left child position to its default (so that the transition is not happening in reverse visually)
    if (universe == "int") {
        if (current_iNode.left == null)
            return;
    }
    else {
        if (current_sNode.left == null)
            return;
    }
    // 0.a. : 
    let canvas = document.querySelector('canvas');
    let cx = canvas.getContext('2d');
    cx.clearRect(140, 60, 30, 20);
    // 1. : 
    parent_card_revealed = false;
    if (universe == "int") {
        current_iNode = current_iNode.left;
    }
    else {
        current_sNode = current_sNode.left;
    }
    // 2. :
    let modify = document.getElementById("right_null");
    modify.style.display = "none";
    modify = document.getElementById("right_face_down");
    modify.style.display = "none";
    modify = document.getElementById("parent_face_up");
    modify.style.display = "none";
    modify = document.getElementById("parent_face_down");
    modify.style.display = "none";
    setTimeout(function () {
        let modify = document.getElementById("parent_face_up");
        modify.style.display = "block";
        modify = document.getElementById("parent_face_down");
        modify.style.display = "block";
        modify = document.getElementById(`right_null`);
        modify.style.display = "block";
        modify = document.getElementById(`right_face_down`);
        modify.style.display = "block";
    }, 1400);
    // 3. : 
    setTimeout(function () {
        let modify = document.getElementById("left_null");
        modify.style.display = "none";
        modify = document.getElementById("left_face_down");
        modify.style.transition = "0.6s";
        modify.style.top = "400px";
        modify.style.left = "910px";
    }, 800);
    // 4.a. : 
    // already done for some unknown reason in 2. 
    // 4.b. : 
    setTimeout(function () {
        let modify = document.getElementById("left_face_down");
        modify.style.transition = "0s";
        modify.style.top = "200px";
        modify.style.left = "650px";
        // if node.left at this point is null make it not be displayed
        if (universe == "int" && current_iNode != null || universe == "string" && current_sNode != null) {
            modify.style.display = "block";
        }
    }, 1400);
    // 0.b. :    
    moving_BST_animation_in_progress = true;
    setTimeout(function () {
        moving_BST_animation_in_progress = false;
    }, 1700);
}
function right_child() {
    console.log("right!");
    // left child inverse !!!!!>>>code duplication<<!!!!!!!!
    if (universe == "int") {
        if (current_iNode.right == null)
            return;
    }
    else {
        if (current_sNode.right == null)
            return;
    }
    // 0.a. : 
    let canvas = document.querySelector('canvas');
    let cx = canvas.getContext('2d');
    cx.clearRect(140, 60, 30, 20);
    // 1. : 
    parent_card_revealed = false;
    if (universe == "int") {
        current_iNode = current_iNode.right;
    }
    else {
        current_sNode = current_sNode.right;
    }
    // 2. :
    let modify = document.getElementById("left_null");
    modify.style.display = "none";
    modify = document.getElementById("left_face_down");
    modify.style.display = "none";
    modify = document.getElementById("parent_face_up");
    modify.style.display = "none";
    modify = document.getElementById("parent_face_down");
    modify.style.display = "none";
    setTimeout(function () {
        let modify = document.getElementById("parent_face_up");
        modify.style.display = "block";
        modify = document.getElementById("parent_face_down");
        modify.style.display = "block";
        modify = document.getElementById(`left_null`);
        modify.style.display = "block";
        modify = document.getElementById(`left_face_down`);
        modify.style.display = "block";
    }, 1400);
    // 3. : 
    setTimeout(function () {
        let modify = document.getElementById("right_null");
        modify.style.display = "none";
        modify = document.getElementById("right_face_down");
        modify.style.transition = "0.6s";
        modify.style.top = "400px";
        modify.style.left = "910px";
    }, 800);
    // 4.a. : 
    // already done for some unknown reason in 2. 
    // 4.b. : 
    setTimeout(function () {
        let modify = document.getElementById("right_face_down");
        modify.style.transition = "0s";
        modify.style.top = "200px";
        modify.style.left = "1200px";
        // if node.left at this point is null make it not be displayed
        if (universe == "int" && current_iNode != null || universe == "string" && current_sNode != null) {
            modify.style.display = "block";
        }
    }, 1400);
    // 0.b. :    
    moving_BST_animation_in_progress = true;
    setTimeout(function () {
        moving_BST_animation_in_progress = false;
    }, 1700);
}
function turn() {
    console.log("turn!");
    if (moving_BST_animation_in_progress) {
        // do nothing, let animation finnish to not display the value of card without the card beneath it
    }
    else {
        let modify = document.getElementById('parent_face_down');
        modify.style.display = "none";
        if (!parent_card_revealed) {
            parent_card_revealed = true;
            if (universe == "int") {
                console.log(`current card revealed is: ${current_iNode.val}`);
            }
            else {
                console.log(`current card revealed is: ${current_sNode.val}`);
            }
            /// add the value to face up cards at the seen array 
            modify = document.getElementById(`seen${seen_cards_count}`);
            modify.style.display = "block";
            seen_cards_count += 1;
            // display value of revealed card both in at parent position and in coresponding index of seen array 
            // parent position: 
            let canvas = document.querySelector('canvas');
            let cx = canvas.getContext('2d');
            cx.beginPath();
            cx.strokeStyle = '#000';
            cx.fillStyle = '#000';
            cx.font = 'bold 8px sans-serif';
            cx.textAlign = 'left';
            cx.textBaseline = 'top';
            cx.lineWidth = 10;
            if (universe == "int") {
                cx.fillText(`${current_iNode.val}`, 148, 70);
                cx.fillText(`${current_iNode.val}`, 12 + (seen_array_index * 33), 130);
            }
            else {
                cx.fillText(`${current_sNode.val}`, 145, 70);
                cx.fillText(`${current_sNode.val}`, 10 + (seen_array_index * 33), 130);
            }
            seen_array_index += 1;
        }
    }
}
