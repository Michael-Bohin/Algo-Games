class view_html {
    bst: BST<unknown>;
    players_order_of_cards: number[] = new Array(31).fill(-9);          // there are 31 cards on board 
    choices_made: number = 0;                                           // number of cards player has turned face up 
    cards_face_up: boolean[] = new Array(32).fill(false);               // including dummy 

    constructor(bst: BST<unknown>) {
        function toggleZoomScreen(scale_percent: number) {
            document.body.style.zoom = `${scale_percent}%`;
        }
        let browser_width: number = window.innerWidth;
        let percentage_change: number = (browser_width / 1920) * 100;
        console.log(browser_width);
        console.log(window.innerHeight);
        console.log(percentage_change);
        toggleZoomScreen(percentage_change);
        console.log(`width after change: ${window.innerWidth}`);
        console.log(`height after change: ${window.innerHeight}`);

        this.bst = bst; 
        document.querySelector('body').innerHTML = this.page_game + `<div id='answer_yes' class="button ice green">${bst.question} is in the tree!</div><div id='answer_no' class="button ice green">${bst.question} is not in the tree!</div>`;
 
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
            this.answer(true);
        }) as EventListener);

        modify_id = document.getElementById('answer_no');
        modify_id.addEventListener("click", ((event: CustomEvent) => {
            this.answer(false);
        }) as EventListener);

        if(bst.game_type_int) {
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
        let temp: string = document.body.innerHTML;
        temp = temp + `<div class="button ice" id="return">Return to portal</div><div class="button ice" id="play_again">Play again</div>`;
        document.body.innerHTML = temp;
        document.getElementById("return").addEventListener("mousedown", function() { window.location.href = "../portal.html"; });
        document.getElementById("play_again").addEventListener("mousedown", function() { window.location.reload(); });
    }

    draw_optimal_search() {
        let temp: string = document.body.innerHTML;
        for(let i: number = 0; i < 5; ++i) {
            let j: number = this.bst.theory_correct_search_order[i];
            if(j != -9) {
                temp = temp + `<img src="highlight.png" style="position: absolute; top: ${this.cards_height[j]}px; left: ${this.cards_width[j]}px; z-index: 2; opacity: 0.45;">`;
            }
        }
        document.body.innerHTML = temp;
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
        console.log(`cards face up: ${this.cards_face_up}`);
        console.log(`players_order_of_cards: ${this.players_order_of_cards}`);
        console.log(`choices made: ${this.choices_made}`);
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

            if(this.bst.game_type_int) {
                this.draw_numbers(i);
            } else {
                this.draw_verbs(i);
            }
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
function init(game_type: boolean) {
    let bst: BST<unknown> = new BST(game_type);
    let view: view_html = new view_html(bst);
}

document.getElementById("integers").addEventListener("mousedown", ev => { init(true); });
document.getElementById("verbs").addEventListener("mousedown", ev => { init(false); });