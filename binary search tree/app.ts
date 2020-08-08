/*class TreeNode<T> {
    public val: T;
    public left: TreeNode<T>;
    public right: TreeNode<T>;
    constructor(val: T) {
        this.val = val;
    }
}*/

class BST<T> {
    //root: TreeNode<T>;                         
    int_permutation: Array<number> = new Array(100);
    string_permutation: Array<string> = new Array(100);
    type_integers: boolean = false;
    public order: Array<number>;
    public ascending_members: Array<number> =  new Array(32);
    public ascending_members_string: Array<string> = new Array(32);
    public q_contains: boolean =  false;
    public hidden_at: number = -1;
    public question: string = '';
    public game_type_int: boolean =  false;

    string_elements: string[] = [
        "be", "have", "do", "say", "go", "get", "make", "know", "think", "take", "see",
        "come", "want", "look", "use", "find", "give", "tell", "work", "call", 
        "try", "ask", "need", "feel", "become", "leave", "put",  "mean", "keep", "let", 
        "begin", "seem", "help", "talk", "turn", "start", "show", "hear", "play", "run", 
        "move", "like", "live", "believe", "hold", "bring", "happen", "write", "provide", "sit", 
        "stand", "lose", "pay", "meet", "include","continue", "set", "learn", "change", "lead", 
        "understand", "watch", "follow", "stop", "create", "speak", "read", "allow", 
        "add", "spend", "grow", "open", "walk", "win", "offer", "remember", "love", "consider", 
        "appear", "buy", "wait", "serve", "die", "send", "expect", "build", "stay", "fall", "cut", 
        "reach", "kill", "remain", "suggest", "pass", "sell", "require", "report", "decide", "pull", "focus"
    ];

    constructor(type_int: boolean) {
        //this.root = null; 
        this.game_type_int = type_int;
        for(let i: number = 0; i < 100; ++i) {
            this.int_permutation[i] = i;
        }
        
        if(type_int) {
            this.type_integers = true;
            this.int_permutation = this.random_permutation(this.int_permutation);
            for(let i:number = 1; i< 32; i++) {
                this.ascending_members[i] = this.int_permutation[i];
            }
            this.ascending_members.sort(function(a, b) {return a-b});
        } else {
            this.string_permutation = this.random_permutation_str(this.string_elements);
            this.ascending_members_string = new Array(32); // including dummy el
            for(let i:number = 1; i< 32; i++) {
                this.ascending_members_string[i] = this.string_permutation[i];
            }
            this.ascending_members_string.sort(); // lexicorgraphical sort is default
        }
        this.order = new Array(32);
        this.order = this.complete_tree_insert_order(32);
        if(this.randint(0,1) > 0.5) {
            this.q_contains = true;
            this.hidden_at = this.randint(1,31);
            if(type_int) {
                this.question =  `${this.ascending_members[this.randint(1,31)]}`;
            } else {
                this.question = this.ascending_members_string[this.randint(1,31)];
            }
        } else {
            if(type_int) {
                this.question =  `${this.int_permutation[50]}`;
            } else {
                this.question = this.string_permutation[50];
            }
        }
    }

    /*public insert(value: T): void {
        let temp: TreeNode<T> = this.root;
        let previous: TreeNode<T> = null;
        while(temp != null) {
            previous = temp;
            if(temp.val > value) {
                temp = temp.left;
            } else {
                temp = temp.right;
            }
        }

        if(previous == null) {
            this.root = new TreeNode(value);
        } else {
            if(previous.val > value)
                previous.left = new TreeNode(value);
            else
                previous.right = new TreeNode(value);
        }
    }*/

    complete_tree_insert_order(size: number): Array<number> {
        let ret: Array<number> = new Array(size);
        // naive out of excel copy  of intended result, not being genral but strict for 31 els
        ret = [
            -1, // dummy
            16, 
            8, 24, 
            4, 12, 20, 28, 
            2, 6, 10, 14, 18, 22, 26, 30,
            1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31
        ];
        return ret; 
    }
    
    /*public contains(value: T): boolean {
        let temp: TreeNode<T> = this.root;
        while(temp != null) {
            if(temp.val > value) {
                temp = temp.left;
            } else if(temp.val < value) {
                temp = temp.right;
            } else {
                return true;
            }
        }
        return false;
    }*/

    randint(min: number, max: number): number { // inclusive type of both min and max
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    random_permutation(arr: Array<number>): Array<number> {
        for(let i: number = 0; i < 100; i++) {
            let temp: number = arr[i];
            let choose: number = this.randint(i,99);
            arr[i] = arr[choose];
            arr[choose] = temp;
        }
        return arr;
    }

    random_permutation_str(arr: Array<string>): Array<string> {
        for(let i: number = 0; i < 100; i++) {
            let temp: string = arr[i];
            let choose: number = this.randint(i,99);
            arr[i] = arr[choose];
            arr[choose] = temp;
        }
        return arr;
    }
}

class view_html {
    bst: BST<unknown>

    constructor(bst: BST<unknown>) {
        this.bst = bst;
                
        document.querySelector('body').innerHTML = this.page_game;  
        for(let i: number = 1; i < 32; i++) {
            document.querySelector('body').innerHTML  += `<img id="node${i}" src="cardfacedown.png">`;
        }
        
        for(let i: number = 1; i < 32; i++) {
            let modify = document.getElementById(`node${i}`);
            modify.addEventListener("click", ((event: CustomEvent) => {
                this.reveal(i);
            }) as EventListener);
        }

        let modify = document.querySelector('svg');
        let s: string = '';
        for(let i: number = 1; i < 16; i++) {
            s = s + 
            `<line x1="${this.cards_width[i] + 5}" y1="${this.cards_height[i] + (128/2) }" x2="${this.cards_width[i*2] + (96/2)}" y2="${this.cards_height[i*2] + 4}" style="stroke:rgb(255,255,255);stroke-width:3" />
            <line x1="${this.cards_width[i] + 96 - 4}" y1="${this.cards_height[i] + (128/2) }" x2="${this.cards_width[i*2 + 1] + (96/2)}" y2="${this.cards_height[i*2 + 1] + 4}" style="stroke:rgb(255,255,255);stroke-width:3" />`;
        }
        modify.innerHTML = s;

        let text = document.getElementById('q');
        if(bst.game_type_int) {
            text.innerHTML = `Is number ${bst.question} in the binary search tree?`;
        } else {
            text.innerHTML = `Is verb '${bst.question}' in the binary search tree?`;
        }

        let modify_id = document.getElementById('answer_yes');
        modify_id.addEventListener("click", ((event: CustomEvent) => {
            this.answer_yes();
        }) as EventListener);

        modify_id = document.getElementById('answer_no');
        modify_id.addEventListener("click", ((event: CustomEvent) => {
            this.answer_no();
        }) as EventListener);
    }

    answer_yes() {
        this.clear();
        let modify = document.getElementById('q');
        if(this.bst.q_contains) {
            modify.innerHTML = `Congratulations! Indeed ${this.bst.question} is in the tree. :)`;
        } else {
            modify.innerHTML = `Oops. Unfortunately ${this.bst.question} is not in the tree. :(`;
        }
    }

    answer_no() {
        this.clear();
        let modify = document.getElementById('q');
        if(this.bst.q_contains) {
            modify.innerHTML = `Oops. Unfortunately ${this.bst.question} is in the tree. :(`;
        } else {
            modify.innerHTML = `Congratulations! Indeed ${this.bst.question} is not in the tree. :)`;
        }
    }

    clear() {
        this.removeElement('answer_yes');
        this.removeElement('answer_no');
    }

    removeElement(elementId: string) {
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    }

    reveal(i: number) {
        let node = document.createElement("img");
        node.src = "cardvalueless.png";
        node.style.position = 'absolute';
        node.style.zIndex = '2';
        node.style.top = `${this.cards_height[i]}px`;
        node.style.left = `${this.cards_width[i]}px`;
        document.querySelector('body').appendChild(node);

        if(this.bst.type_integers) {
            this.draw_numbers(i);
        } else {
            this.draw_verbs(i);
        }
    }

    draw_numbers(i: number): void {
        let draw_number: number = this.bst.ascending_members[this.bst.order[i]-1];
        console.log(draw_number);
        let tens: number = Math.floor(draw_number / 10);
        let units: number = draw_number % 10;

        // create element representing tens, except 0
        if(tens != 0) {
            let node = document.createElement('img');
            node.src = `include.png`;
            node.src = `./integers/${tens}.png`;
            node.style.position = 'absolute';
            node.style.zIndex = '3';
            node.style.top = `${this.cards_height[i] }px`;
            node.style.left = `${this.cards_width[i] }px`;
        
            node.style.top = `${this.cards_height[i] + 34}px`;
            node.style.left = `${this.cards_width[i] + 12}px`;
            document.querySelector('body').appendChild(node);
        }
            
        let node = document.createElement('img');
        node.src = `./integers/${units}.png`;
        node.style.position = 'absolute';
        node.style.zIndex = '3';
        node.style.top = `${this.cards_height[i] + 34}px`;
        node.style.left = `${this.cards_width[i] + 52}px`;
        if(tens == 0) 
            node.style.left = `${this.cards_width[i] + 32}px`;
        document.querySelector('body').appendChild(node);
    }

    draw_verbs(i: number): void {
        let verb: string = this.bst.ascending_members_string[this.bst.order[i]-1];
        console.log(verb);
        let node = document.createElement('img');
        node.src = `./verbs/${verb}.png`;
        node.style.position = 'absolute';
        node.style.zIndex = '3';
        node.style.top = `${this.cards_height[i] + 51}px`;
        node.style.left = `${this.cards_width[i]}px`;
        document.querySelector('body').appendChild(node);
    }

    page_game: string = `
    <div id="white_background"></div>
    <p id="q"></p>   
    <img src="board.jpg" id="board">  
    <svg height="1000" width="2000" style="position: absolute; z-index: 0; top: 0px; left: 0px;"></svg>
    <button id='answer_yes'>Yes, it is in the binary tree!</button>
    <button id='answer_no'>No! It is not in the binary tree!</button>
    `;
    
    cards_width: Array<number> = [
        0,                                          // dummy element 
        904,                                        // 1st row 
        460, 1348,                                  // 2nd
        238, 682, 1126, 1570,                       // 3rd
        127, 349, 571, 793, 1015, 1237, 1459, 1681, // 4th
        72, 183, 294, 405, 516, 627,738, 849, 960, 1071, 1182, 1293, 1404, 1515, 1626, 1737 // 5th
    ];

    cards_height: Array<number> = [
        0,                                          // dummy element 
        180,                                        // 1st
        308, 308,                                   // 2nd
        436, 436, 436, 436,                         // 3rd
        564, 564, 564, 564, 564, 564, 564, 564,     // 4th
        692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692   // 5th
    ];
}

var bst;
var view;

function init(game_type: string) {
    bst = new BST(game_type == 'ints');
    view = new view_html(bst);
}