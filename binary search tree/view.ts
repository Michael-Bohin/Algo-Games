class view_html {
    bst: BST;
    players_order_of_cards: number[] = new Array(31).fill(-9);          // there are 31 cards on board 
    choices_made: number = 0;                                           // number of cards player has turned face up 
    cards_face_up: boolean[] = new Array(32).fill(false);               // including dummy 
    public level2: boolean = false;
    public operation: string;
    game_ints: boolean = false;

    string_initial_elements: string[] = [
        "add", "allow", "appear", "ask", "be", "become", "begin", "believe", "bring", "build", "buy", "call", 
        "change", "come", "consider", "continue", "create", "cut", "decide", "die", "do", "expect", "fall", 
        "feel", "find", "focus", "follow", "get", "give", "go", "grow", "happen", "have", "hear", "help", 
        "hold", "include", "keep", "kill", "know", "lead", "learn", "leave", "let", "like", "live", "look", 
        "lose", "love", "make", "mean", "meet", "move", "need", "offer", "open", "pass", "pay", "play", "provide",
        "pull", "put", "reach", "read", "remain", "remember", "report", "require", "run", "say", "see", "seem", 
        "sell", "send", "serve", "set", "show", "sit", "speak", "spend", "stand", "start", "stay", "stop", 
        "suggest", "take", "talk", "tell", "think", "try", "turn", "understand", "use", "wait", "walk", "want", 
        "watch", "win", "work", "write"
    ];

    constructor(bst: BST, game_ints: boolean) {
        this.game_ints = game_ints; this.bst = bst; 
        function toggleZoomScreen(scale_percent: number) {
            document.body.style.transform = `scale(0.${scale_percent})`;
        }
        let browser_width: number = window.innerWidth;
        let percentage_change: number = (browser_width / 1920) * 100;
        toggleZoomScreen(percentage_change);
        let v: string = this.string_initial_elements[parseInt(bst.question)];
        if(game_ints)
            v = `${bst.question}`;

        document.querySelector('body').innerHTML = this.page_game + `<div id='answer_yes' class="button ice green">${v} is in the tree!</div><div id='answer_no' class="button ice green">${v} is not in the tree!</div>`;
 
        for(let i: number = 1; i < 32; i++) 
            document.querySelector('body').innerHTML  += `<img id="node${i}" src="cardfacedown.png">`;
        for(let i: number = 1; i < 32; i++) 
            document.getElementById(`node${i}`).addEventListener("mousedown", ev => { this.reveal(i);});

        let modify = document.querySelector('svg');
        let s: string = '';
        for(let i: number = 1; i < 16; i++) {
            s = s + 
            `<line x1="${this.cards_width[i] + 5}" y1="${this.cards_height[i] + (128/2) }" x2="${this.cards_width[i*2] + (96/2)}" y2="${this.cards_height[i*2] + 4}" style="stroke:rgb(255,255,255);stroke-width:3" />
            <line x1="${this.cards_width[i] + 96 - 4}" y1="${this.cards_height[i] + (128/2) }" x2="${this.cards_width[i*2 + 1] + (96/2)}" y2="${this.cards_height[i*2 + 1] + 4}" style="stroke:rgb(255,255,255);stroke-width:3" />`;
        }
        modify.innerHTML = s;

        let text = document.getElementById('q');
        text.innerHTML = `Is verb '${v}' in the binary search tree?`;
        if(game_ints)
            text.innerHTML = `Is number ${bst.question} in the binary search tree?`;

        let modify_id = document.getElementById('answer_yes');
        modify_id.addEventListener("click", ((event: CustomEvent) => {
            this.answer(true);
        }) as EventListener);

        modify_id = document.getElementById('answer_no');
        modify_id.addEventListener("click", ((event: CustomEvent) => {
            this.answer(false);
        }) as EventListener);

        if(game_ints) {
            document.getElementById("answer_no").style.width = "300px";
            let el: HTMLElement = document.getElementById("answer_yes");
            el.style.width = "300px"; el.style.left = "517px";
        }
    }

    answer(yes: boolean) {
        this.clear();
        this.bst.evaluate_player(this.players_order_of_cards, yes);
        if(!this.bst.player_search_order) // if the order of cards player picked is not correct highlight the cards in order with green opaque color
            this.draw_optimal_search();
        let el: HTMLElement = document.getElementById('q'); 
        el.innerHTML = this.comment(this.bst.player_search_order, this.bst.player_contain_answer);
        el.style.left = "50px"; el.style.width = "1800px"; el.style.textAlign = "center"; el.style.lineHeight = "36px"; el.style.marginTop = "0px"; el.style.marginBottom = "0px"; 
        el.style.top = "130px";
        document.body.innerHTML += `<div class="button ice" id="return">Return to portal</div><div class="button ice" id="play_again">Play again</div>`;
        document.getElementById("return").addEventListener("mousedown", function() { window.location.href = "../portal.html"; });
        document.getElementById("play_again").addEventListener("mousedown", function() { window.location.reload(); });
    }

    draw_optimal_search() {
        for(let i: number = 0; i < 5; ++i) {
            let j: number = this.bst.theory_correct_search_order[i];
            if(j != -9)
                document.body.innerHTML += `<img src="highlight.png" style="position: absolute; top: ${this.cards_height[j]}px; left: ${this.cards_width[j]}px; z-index: 2; opacity: 0.45;">`;
        }
    }

    comment(order: boolean, answer: boolean): string {
        function randint(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1) ) + min;}
        let emojis: string[] = ["🔥", "👍", "👌", "👏", "🤗", "💪", "🎉", "✌", "✨", "🙌"];
        let emo_array: string[] = [emojis[randint(0,9)], emojis[randint(0,9)], emojis[randint(0,9)], emojis[randint(0,9)]];
        let audio = new Audio('./loss.mp3');
        let ret: string = "Nope! Please look at the highlighted cards, search method turns face up these. Observe. And try again! 😁"
        if(order && answer) {
            ret = `Congratulations! ${emo_array[0]}${emo_array[1]}${emo_array[2]}${emo_array[3]} You have successfully imitated the search method!`;
            audio = new Audio('./victory.mp3');
        } else if(order && !answer) {
            ret = `Oh no! You did the search right! ${emo_array[2]} But pressed the wrong button. 😆 `;
        }
        audio.play();
        return ret;
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
        if(!this.cards_face_up[i]) { // all cards can be turned face up at most once 
            this.cards_face_up[i] = true;
            this.players_order_of_cards[this.choices_made] = i;
            this.choices_made += 1;
            let node = document.createElement("img");
            node.src = "cardvalueless.png";
            node.style.position = 'absolute';
            node.style.zIndex = '2';
            node.style.top = `${this.cards_height[i]}px`;
            node.style.left = `${this.cards_width[i]}px`;
            document.querySelector('body').appendChild(node);
            if(this.game_ints) {
                this.draw_numbers(i);
            } else {
                this.draw_verbs(i);
            }
        }
    }

    draw_numbers(i: number): void {
        let draw_number: number = <number>this.bst.ascending_members[this.bst.order[i]-1];
        console.log(draw_number);
        let Top: number = this.cards_height[i] + 34;
        if(this.level2) {
            this.draw_operation(i, draw_number);
        } else {
            let tens: number = Math.floor(draw_number / 10);
            let units: number = draw_number % 10;
            if(tens != 0) {
                this.__create_element(`${tens}`, 1, Top, i, 12);
            }  
            let left: number = 52;
            if(tens == 0)
                left = 32;
            this.__create_element(`${units}`, 1, Top, i, left);
        }
    }

    draw_operation(i: number, result: number): void {
        function randint(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1) ) + min; }
        let a, b: number;
        if(this.operation == "add") {
            a = randint(0, result); b = result - a; 
            if(randint(0,1) == 1) {
                let temp: number = a;
                a = b; b = temp;
            }
        } else if(this.operation == "sub") {
            a = randint(result, 100); b = a - result;
        } 
        this.__draw_numbers_op(i, a, true);
        this.__draw_numbers_op(i, b, false);
    }

    __draw_numbers_op(i: number, num: number, a: boolean): void {
        let tens: number = Math.floor(num / 10);
        let units: number = num % 10;
        let Top: number = this.cards_height[i] + 14;
        if(!a)
            Top += 40;
        if(tens != 0)
            this.__create_element(`${tens}`, 0.5, Top, i, 31); 
        this.__create_element(`${units}`, 0.5, Top, i, 52);
        if(!a) {
            let source: string = "plus";
            if(this.operation == "sub") 
                source = "minus";
            this.__create_element(source, 0.8, Top, i, 6);
        }
    }

    __create_element(source: string, scale: number, Top: number, i: number, left_offset: number): void {
        let node = document.createElement('img');
        node.src = `./integers/${source}.png`;
        node.style.position = 'absolute';
        node.style.zIndex = '3';
        node.style.transform = `scale(${scale})`;
        node.style.top = `${Top}px`;
        node.style.left = `${this.cards_width[i] + left_offset}px`;
        document.querySelector('body').appendChild(node);
    }

    draw_verbs(i: number): void {
        let verb: string = this.string_initial_elements[this.bst.ascending_members[this.bst.order[i]-1]];
        console.log(verb);
        let node = document.createElement('p');
        node.className = "p_lesson";
        if(verb.length == 7)
            node.style.fontSize = "30px";
        if(verb.length == 8)
            node.style.fontSize = "24px";
        if(verb.length > 8)
            node.style.fontSize = "20px";
        node.style.top = `${this.cards_height[i]}px`;
        node.style.left = `${this.cards_width[i]}px`;
        node.innerHTML = verb;
        document.querySelector('body').appendChild(node);
    }

    page_game: string = `
        <div id="white_background"></div>
        <p id="q"></p>   
        <img src="board.jpg" id="board">  
        <svg height="1000" width="2000" style="position: absolute; z-index: 0; top: 0px; left: 0px;"></svg>`;
    
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
        200,                                        // 1st
        308, 308,                                   // 2nd
        436, 436, 436, 436,                         // 3rd
        564, 564, 564, 564, 564, 564, 564, 564,     // 4th
        692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692, 692   // 5th
    ];
}
/* ------------- run: ------------ */



function init(game_type: boolean, level2:string) {
    let bst: BST = new BST();
    let view: view_html = new view_html(bst, game_type);
    if(level2 != "") {
        view.level2 = true;
        view.operation = level2;
    }
}
document.getElementById("integers").addEventListener("mousedown", ev => { init(true, ""); });
document.getElementById("verbs").addEventListener("mousedown", ev => { init(false, ""); });
document.getElementById("level2").addEventListener("mousedown", ev => {
    function removeElement(elementId: string) {
        let element: HTMLElement = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    }
    removeElement("integers");
    removeElement("verbs");
    removeElement("level2");
    document.body.innerHTML += `<div id="addi" class="button ice green">Addition</div><div id="subs" class="button ice green">Subtraction</div>`;
    document.getElementById("addi").addEventListener("mousedown", ev => { init(true, "add"); });
    document.getElementById("subs").addEventListener("mousedown", ev => { init(true, "sub"); });
});