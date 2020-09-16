class BST {       
    permutation: Array<number> = new Array(100);
    public order: number[] = [ -1, // dummy
        16, 
        8, 24, 
        4, 12, 20, 28, 
        2, 6, 10, 14, 18, 22, 26, 30,
        1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31
    ];
    public ascending_members: Array<number> =  new Array(32);
    public q_contains: boolean =  false;
    public question: string = '';
    public game_type_int: boolean =  false;
    // plr eval:
    public theory_correct_search_order: number[] = new Array(1, -9, -9, -9, -9); // at most 5 searches, -9 = no search 
    public player_search_order: boolean; // did the player pick correct search order? 
    public player_contain_answer: boolean; // did the player answer contain question correctly? 

    constructor() {
        for(let i: number = 0; i < 100; ++i)
            this.permutation[i] = i;
        
        this.permutation = this.random_permutation(this.permutation);
        for(let i:number = 1; i< 32; i++) 
            this.ascending_members[i] = this.permutation[i];
        this.ascending_members.sort(function(a, b) {return a-b});
        
        if(this.randint(0,1) > 0.5) {
            this.q_contains = true;
            this.question =  `${this.ascending_members[this.randint(1,31)]}`;
        } else {
            this.question =  `${this.permutation[50]}`;
        }
    }

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

    public evaluate_player(answer_order: number[], answer_yes: boolean): void {
        /* 1.: generate correct order of cards
         * 2.: evaluate whether order of turned cards is correct 
         * 3.: evaluate whether contains answer matches reality and save both to booleans of game
         * 1.>>> */
        for(let i: number = 1; i < 5; ++i) {                // for loop seems more practical (vs recursion) since I am saving result to array in order to index of i
            let crossroads: number = this.traffic_light(i); // negative go left, 0 stop!, positive go right 
            if(crossroads == 0) 
                break;
            else 
                this.theory_correct_search_order[i] = this.go_left(crossroads < 0, i);
        } 
        /* 2.>>> */ this.player_search_order = this.evaluate_order(answer_order);  
        /* 3.>>> */ this.player_contain_answer = (answer_yes == this.q_contains);  
        console.log(`${this.theory_correct_search_order}, order: ${this.player_search_order}, btn: ${this.player_contain_answer}`);
    }

    evaluate_order(answer_order: number[]): boolean {
        if(answer_order[5] != -9)
            return false;
        for(let i: number = 0; i < 5; ++i) {                                // returns true if and only if the order of player matches theory optimum 
            if(this.theory_correct_search_order[i] == -9) return true;                  // element has been found shallower than at depth 5, with preceeding order being correct
            if(this.theory_correct_search_order[i] != answer_order[i]) return false;    // order of players choices doesn't match 
        }
        return true;
    }

    traffic_light(depth: number): number {
        let unk: number;
        let compare_vs: number;
        unk = parseInt(this.question);
        compare_vs = this.ascending_members[this.order[this.theory_correct_search_order[depth-1]] - 1];
        console.log(`unk : compare_vs >>> ${unk} : ${compare_vs}`);
        if(unk == compare_vs) {
            return 0;
        } else if(unk < compare_vs) {
            return -1;
        } return 1;       
    }

    go_left(left: boolean, depth: number): number {
        let ret: number = this.theory_correct_search_order[depth-1] * 2;
        if(!left)
            ret += 1;
        return ret;
    }
}